package com.ttetrafon.reflection;

public class Main {
    public static void main(String[] args) {
        System.out.println(Outer.class);
        System.out.println(Outer.class);

        System.out.println(Outer.Inner.class);
        System.out.println(Outer.Inner.class);
    }
}
