package com.ttetrafon.springboot.framework.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Marks a class as a managed component — equivalent to Spring's @Component.
// The framework will automatically create an instance of this class and manage its lifecycle.
// Other classes can then have this component injected via @Autowired.
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Service { }
