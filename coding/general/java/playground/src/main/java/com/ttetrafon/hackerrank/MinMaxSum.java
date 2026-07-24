package com.ttetrafon.hackerrank;

import java.util.List;

public class MinMaxSum {
    public static void miniMaxSum(List<Integer> arr) {
        int len = arr.size();
        var sortedNumbers = arr.stream().sorted().toList();
        Long min = 0L;
        Long max = 0L;

        for (int i = 0; i < len; i++) {
            if (i < len - 1) {
                min += sortedNumbers.get(i);
            }
            if (i > 0) {
                max += sortedNumbers.get(i);
            }
        }

        System.out.println(min + " " + max);
    }
}
