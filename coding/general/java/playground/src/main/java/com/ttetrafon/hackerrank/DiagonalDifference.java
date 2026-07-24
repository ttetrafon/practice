package com.ttetrafon.hackerrank;

import java.util.List;

public class DiagonalDifference {
    public static int diagonalDifference(List<List<Integer>> arr) {
        int len = arr.size(); // check once, since it is a square matrix...

        // left-to-right diagonal is at (1,1), (2, 2), ..., (n, n)
        int ltr = 0;
        // right-to-left diagonal is at (n,1), (n-1, 2), ..., (1,n)
        int rtl = 0;

        for (int i = 0; i < len; i++) {
            ltr += arr.get(i).get(i);
            rtl += arr.get(i).get(len - i - 1);
        }

        return Math.abs(ltr - rtl);
    }
}
