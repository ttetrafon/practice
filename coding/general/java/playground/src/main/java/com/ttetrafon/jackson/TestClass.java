package com.ttetrafon.jackson;

import java.util.List;

public class TestClass {
    public String name;
    public int age;
    public List<String> hobbies;
    public String secret;

    @Override
    public String toString() {
        return "TestClass: name=" + name + ", age=" + age + ", hobbies=" + hobbies;
    }
}
