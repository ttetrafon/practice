package com.ttetrafon.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Important {
    // An @interface defines a new annotation
    // @Target(): defines where the annotation applies; if missing, it can be applied to everything; can take multiple options within {}
    // @Retention(): defines how the annotation functionality persists
    // - Source: only appies in the editor, discarded when compiled
    // - Class: persists through compilation of classes, but is discarded when the program runs
    // - Runtime: persists throughout the program's compilation and run
}
