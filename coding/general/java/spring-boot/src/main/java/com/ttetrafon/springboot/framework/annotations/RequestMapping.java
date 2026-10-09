package com.ttetrafon.springboot.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Declares a base URL path for every route in a controller — equivalent to Spring's
// class-level @RequestMapping.
// @Target(ElementType.TYPE) means it can only be placed on classes.
// The router prepends this value to the path of each @Get method, so
// @RequestMapping("/api/v1/users") + @Get("/{id}") becomes "/api/v1/users/{id}".
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequestMapping {
    String value() default ""; // The shared prefix for this controller, e.g. "/api/v1/users"
}
