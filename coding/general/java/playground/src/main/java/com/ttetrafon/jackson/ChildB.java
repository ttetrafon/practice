package com.ttetrafon.jackson;

public record ChildB(
        String prop1,
        Boolean prop2,
        Integer prop3
) implements Child {}
