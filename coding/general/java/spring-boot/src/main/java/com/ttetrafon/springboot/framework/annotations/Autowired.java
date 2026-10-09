package com.ttetrafon.springboot.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Tells the framework to automatically inject dependencies.
// Equivalent to Spring's @Autowired.
// On a FIELD: the container finds a matching instance by type and sets it via reflection.
// On a CONSTRUCTOR: the container resolves every parameter by type and passes them in.
// Like Spring 4.3+, a class with exactly one constructor doesn't need the annotation at all —
// that constructor is used automatically. You only need @Autowired to pick between several.
@Target({ElementType.FIELD, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
public @interface Autowired { }
