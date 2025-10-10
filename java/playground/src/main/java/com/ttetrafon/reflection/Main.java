package com.ttetrafon.reflection;

public class Main {
    public static void main(String[] args) {
        System.out.println(Outer.class);
        System.out.println(Outer.Inner.class);

        Type type = null;
        if (type instanceof Type.TypeAlpha) {
            System.out.println("TypeAlpha");
        } else if (type instanceof Type.TypeBeta) {
            System.out.println("TypeBeta");
        } else {
            System.out.println("... unknown type");
        }
    }
}
