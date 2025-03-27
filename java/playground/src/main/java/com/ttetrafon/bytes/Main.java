package com.ttetrafon.bytes;

public class Main {

    public static void main(String[] args) {
        int[] byteArray = {112, 99, 115, 46, 101, 113, 117, 105, 112, 109, 101, 110, 116, 46, 115, 121, 110, 99, 46, 105, 110, 115, 101, 114, 116, 101, 100};

        String str = new String(byteArray, 0, byteArray.length);
        System.out.println(str);
    }
}
