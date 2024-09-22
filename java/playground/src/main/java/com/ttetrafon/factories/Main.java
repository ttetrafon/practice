package com.ttetrafon.factories;

public class Main {
    public static void main(String[] args) {
        VehicleFactory factory = new VehicleFactory();

        Vehicle car = factory.createVehicle("car");
        car.drive();

        Vehicle bike = factory.createVehicle("bike");
        bike.drive();
    }
}
