package com.ttetrafon.jackson;

public record Parent(
        String messageId,
        String contents,
        Child child
) {
}
