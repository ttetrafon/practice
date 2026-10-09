package com.ttetrafon.springboot.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Maps a method to an HTTP GET request — equivalent to Spring's @GetMapping.
// @Target(ElementType.METHOD) means this annotation can only be placed on methods.
// value() holds the URL path pattern, e.g. @Get("/api/users").
// It defaults to "" so a method can just say @Get and inherit the whole path
// from the controller's @RequestMapping.
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Get {
    String value() default ""; // The URL path this method handles, appended to the controller's base path
}
