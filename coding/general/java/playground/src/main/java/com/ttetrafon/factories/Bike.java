package com.ttetrafon.factories;

public class Bike implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Driving a bike...");
    }
}
