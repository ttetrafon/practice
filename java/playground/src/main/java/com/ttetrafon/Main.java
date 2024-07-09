package com.ttetrafon;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");

        List<String> list = new java.util.ArrayList<>(List.of("alpha", "beta", "gamma"));
        list.remove("beta");
        System.out.println(list);
    }
}