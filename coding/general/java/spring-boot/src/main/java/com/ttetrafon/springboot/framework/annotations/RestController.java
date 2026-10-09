package com.ttetrafon.springboot.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Marks a class as a REST controller — equivalent to Spring's @RestController.
// @Target(ElementType.TYPE) means this annotation can only be placed on classes (not methods or fields).
// @Retention(RetentionPolicy.RUNTIME) means it's available via reflection at runtime (not just at compile time).
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface RestController { }
