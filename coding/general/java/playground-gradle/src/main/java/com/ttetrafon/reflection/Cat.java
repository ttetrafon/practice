package com.ttetrafon.reflection;

public record Cat(String name, Integer age) {

    public void meow() {
        IO.println(name + " meows!");
    }

    public void eat() {
        IO.println(name + " munches down a mouse!");
    }
}
