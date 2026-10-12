package com.ttetrafon.annotations;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class AnnotationsMain {

    static void main() throws InvocationTargetException, IllegalAccessException {
        Cat c = new Cat("Toula", 3);

        // We can check if a class is annotated by checking its class.
        if (c.getClass().isAnnotationPresent(Important.class)) {
            IO.println("'Cat' is @Important!");
        }
        else {
            IO.println("'Cat' is not @Important :(");
        }

        // Similarly, we can check for annotations on methods.
        for (Method method: c.getClass().getDeclaredMethods()) {
            if (method.isAnnotationPresent(RunImmediately.class)) {
                RunImmediately ann = method.getAnnotation(RunImmediately.class);
                for (int i = 0; i < ann.times(); i++) {
                    method.invoke(c);
                }
            }
        }

        for (Field field: c.getClass().getDeclaredFields()) {
            IO.println(" - '" + field.getName() + "' with type '" + field.getType() + "'");
            if (field.isAnnotationPresent(ImportantString.class)) {
                IO.println("    ... has annotation ImportantString");
                Object obj = field.get(c);
                if (obj instanceof String value) {
                    IO.println(field.getName() + "=" + value.toUpperCase());
                }
            }
        }
    }
}
