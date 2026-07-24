package com.ttetrafon.objects;

public class Main {
    public static void main(String[] args) {
        Workzone workzone = new Workzone(0);
        System.out.println("count: " + workzone.count() + " -> " + workzone.incrementAndReturnCount());
    }
}
