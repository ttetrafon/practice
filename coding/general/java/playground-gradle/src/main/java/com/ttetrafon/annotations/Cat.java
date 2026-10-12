package com.ttetrafon.annotations;

@Important
public class Cat {

    @ImportantString
    public String name;
    public Integer age;

    public Cat(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    @RunImmediately(times = 3)
    public void meow() {
        IO.println(name + " meows!");
    }

    public void eat() {
        IO.println(name + " munches down a mouse!");
    }

    public String getName() {
        return name;
    }
}
