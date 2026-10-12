package com.ttetrafon.reflection;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class Main {

    static void main(String[] args) {
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

        // .getClass() is the entry point for most Reflection capabilities
        Cat cat = new Cat("Toula", 5);
        Class<? extends Cat> catClass = cat.getClass();

        IO.println("... fields:");
        Field[] catFields = catClass.getDeclaredFields();
        for (Field field : catFields) {
            IO.println("- " + field.getName() + " [" + field.getType() + "]");
        }
        if (catFields.length == 0) {
            IO.println("   ... no public fields available!");
        }

        IO.println("... methods:");
        Method[] catMethods = catClass.getDeclaredMethods();
        for (Method method: catMethods) {
            IO.println("- " + method.getName() + "[returns: " + method.getGenericReturnType() + "]");
        }
    }
}
