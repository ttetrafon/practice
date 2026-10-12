package com.ttetrafon.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RunImmediately {

    // Parameters must be defined as methods.
    // A param can be of type:
    // - primitive
    // - string
    // - class
    // - an array of the above

    // A default is optional, and is added with `default #` after the declaration.

    int times() default 1;
}
