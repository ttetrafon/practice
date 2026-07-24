package com.ttetrafon.hackerrank;

import java.text.DecimalFormat;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class NumberCounting {
    public static void plusMinus(List<Integer> arr) {
        // Write your code here
        int total = arr.size();
        AtomicInteger positives = new AtomicInteger();
        AtomicInteger negatives = new AtomicInteger();
        AtomicInteger zeroes = new AtomicInteger();

        arr.forEach(el -> {
            if (el > 0) {
                positives.getAndIncrement();
            } else if (el < 0) {
                negatives.getAndIncrement();
            } else {
                zeroes.getAndIncrement();
            }
        });

        DecimalFormat df = new DecimalFormat("0.000000");
        System.out.println(df.format((float) positives.get() / total));
        System.out.println(df.format((float) negatives.get() / total));
        System.out.println(df.format((float) zeroes.get() / total));
    }
}
