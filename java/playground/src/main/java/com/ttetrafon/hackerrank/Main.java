package com.ttetrafon.hackerrank;

import java.util.List;

public class Main {
    public static void main(String[] args) {

//        NumberCounting.plusMinus(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, -1, -2, -3, -4));

//        MinMaxSum.miniMaxSum(List.of(1, 14, 7, 9, 5)); // expected result: `22 35`

//        String res = TimeConversion.timeConversion("12:45:54PM");
//        System.out.println(res);

//        int res = LonelyInteger.lonelyInteger(List.of(0, 0, 1, 2, 1));
//        System.out.println(res);

//        int res = DiagonalDifference.diagonalDifference(List.of(
//                List.of(1, 2, 3),
//                List.of(4, 5, 6),
//                List.of(9, 8, 9)
//        ));
//        System.out.println(res);

        List<Integer> res = CountingSort.countingSort(List.of(1, 1, 3, 2, 1));
        System.out.println(res);
    }
}
