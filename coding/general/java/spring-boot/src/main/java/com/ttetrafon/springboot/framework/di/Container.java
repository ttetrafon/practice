package com.ttetrafon.springboot.framework.di;

import com.ttetrafon.springboot.framework.annotations.Autowired;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.util.*;

// The IoC (Inversion of Control) container — this is the heart of dependency injection.
// Equivalent to Spring's ApplicationContext.
// It creates objects and wires their dependencies together automatically.
public class Container {

    // Stores all managed instances: Class → singleton instance
    // This is our "bean registry" — just a simple HashMap.
    private final Map<Class<?>, Object> instances = new HashMap<>();

    // Every class the container knows how to build. We need this list *before* we start
    // creating anything, because a constructor parameter may point at a bean that
    // doesn't exist yet — we look it up here and build it on demand.
    private final List<Class<?>> beanTypes = new ArrayList<>();

    // The classes we're in the middle of constructing right now. If we're asked to build
    // something that's already in here, the dependencies form a cycle (A needs B, B needs A)
    // and we'd recurse forever — so we fail with a clear message instead.
    private final Set<Class<?>> underConstruction = new LinkedHashSet<>();

    // Registers one or more classes with the container.
    // Each class is created recursively: to build a bean we first build everything
    // its constructor asks for, then we fill in any @Autowired fields.
    public void register(Class<?>... classes) {
        // Remember every class first — creation order shouldn't matter, so a controller
        // can be registered before the service it depends on.
        Collections.addAll(beanTypes, classes);

        // First pass: create an instance of each class (and, recursively, its dependencies)
        for (Class<?> clazz : classes) {
            create(clazz);
        }

        // Second pass: scan every instance's fields for @Autowired and inject dependencies.
        // Constructor injection is preferred, but field injection still works — a bean built
        // in the first pass may have @Autowired fields that are still null.
        for (Object instance : instances.values()) {
            injectFields(instance);
        }
    }

    // Retrieves a managed instance by its class type.
    // Example: container.get(UserService.class) → the UserService singleton
    @SuppressWarnings("unchecked")
    public <T> T get(Class<T> clazz) {
        return (T) instances.get(clazz);
    }

    // Creates a singleton instance of a class, building its constructor dependencies first.
    // This is the recursive heart of the container.
    private Object create(Class<?> clazz) {
        // Already built? Reuse it — one instance per class (singleton pattern).
        Object existing = instances.get(clazz);
        if (existing != null) {
            return existing;
        }

        // add() returns false if the class is already in the set, which means we've come
        // back around to something we're still building → circular dependency.
        if (!underConstruction.add(clazz)) {
            throw new RuntimeException(
                    "Circular dependency detected while creating " + clazz.getName()
                            + " (chain: " + describeChain() + ")"
            );
        }

        try {
            // Pick which constructor to call — see chooseConstructor() below
            Constructor<?> constructor = chooseConstructor(clazz);

            // Resolve each constructor parameter into an actual bean instance.
            // This is where the recursion happens: a parameter may not exist yet,
            // in which case create() is called for it too.
            Class<?>[] parameterTypes = constructor.getParameterTypes();
            Object[] arguments = new Object[parameterTypes.length];
            for (int i = 0; i < parameterTypes.length; i++) {
                arguments[i] = resolve(parameterTypes[i], clazz);
            }

            // setAccessible(true) lets us call package-private or private constructors
            constructor.setAccessible(true);
            // Call the constructor with the dependencies we just resolved
            Object instance = constructor.newInstance(arguments);
            // Store it in our map so the next request for this type reuses it
            instances.put(clazz, instance);
            return instance;
        } catch (RuntimeException e) {
            throw e; // Already has a useful message — don't wrap it again
        } catch (Exception e) {
            throw new RuntimeException("Failed to instantiate " + clazz.getName(), e);
        } finally {
            // We're done with this class either way — take it off the in-progress set
            underConstruction.remove(clazz);
        }
    }

    // Decides which constructor the container should call.
    // Mirrors Spring's rules:
    //   1. A constructor annotated with @Autowired wins.
    //   2. Otherwise, if there's exactly one constructor, use it (no annotation needed).
    //   3. Otherwise, fall back to the no-arg constructor.
    private Constructor<?> chooseConstructor(Class<?> clazz) {
        Constructor<?>[] constructors = clazz.getDeclaredConstructors();

        // Rule 1 — an explicitly annotated constructor
        for (Constructor<?> constructor : constructors) {
            if (constructor.isAnnotationPresent(Autowired.class)) {
                return constructor;
            }
        }

        // Rule 2 — a single constructor is unambiguous, so just use it
        if (constructors.length == 1) {
            return constructors[0];
        }

        // Rule 3 — several constructors and no @Autowired: we need the no-arg one
        try {
            return clazz.getDeclaredConstructor();
        } catch (NoSuchMethodException e) {
            throw new RuntimeException(
                    clazz.getName() + " has " + constructors.length + " constructors and no no-arg"
                            + " constructor — annotate the one to use with @Autowired"
            );
        }
    }

    // Turns a required type into an instance: reuse one if it's already built,
    // otherwise find a registered class that fits and build it now.
    private Object resolve(Class<?> type, Class<?> requiredBy) {
        // Is there already an instance we can hand over?
        Object existing = findByType(type);
        if (existing != null) {
            return existing;
        }

        // Not yet — look for a registered class that can satisfy this type and create it
        for (Class<?> candidate : beanTypes) {
            if (type.isAssignableFrom(candidate)) {
                return create(candidate);
            }
        }

        // Nothing matches — the developer forgot to annotate the class with @Service
        throw new RuntimeException(
                "No bean found of type " + type.getName() + " to inject into " + requiredBy.getName()
        );
    }

    // Injects any @Autowired fields on an already-created instance.
    // Kept alongside constructor injection so both styles work.
    private void injectFields(Object instance) {
        // getDeclaredFields() returns ALL fields (including private ones)
        for (Field field : instance.getClass().getDeclaredFields()) {
            // Check if this field has @Autowired on it
            if (field.isAnnotationPresent(Autowired.class)) {
                // Find (or build) an instance that matches this field's type
                Object dependency = resolve(field.getType(), instance.getClass());
                // setAccessible(true) lets us write to private fields
                field.setAccessible(true);
                try {
                    // Inject the dependency — set the field's value on the instance
                    field.set(instance, dependency);
                } catch (IllegalAccessException e) {
                    throw new RuntimeException("Failed to inject " + field.getName(), e);
                }
            }
        }
    }

    // Finds an already-created instance that is assignable to the given type.
    // Uses isAssignableFrom() so it works with interfaces and superclasses too.
    // Example: if you ask for type "UserService", it will match a registered "UserService" class.
    private Object findByType(Class<?> type) {
        for (Map.Entry<Class<?>, Object> entry : instances.entrySet()) {
            // isAssignableFrom checks: "can the requested type hold this class?"
            // This handles both exact matches and subclass/interface relationships.
            if (type.isAssignableFrom(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null; // No matching bean found
    }

    // Renders the chain of beans we're currently building, e.g. "A -> B -> A",
    // so a circular dependency error tells you exactly where the loop is.
    private String describeChain() {
        List<String> names = new ArrayList<>();
        for (Class<?> clazz : underConstruction) {
            names.add(clazz.getSimpleName());
        }
        return String.join(" -> ", names);
    }
}
