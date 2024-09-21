package com.ttetrafon.hackerrank;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CountingSort {
    public static List<Integer> countingSort(List<Integer> arr) {
        // create the frequency map
        List<Integer> frequencies = new ArrayList<>(Collections.nCopies(100, 0));
        for (int value : arr) {
            frequencies.set(value, frequencies.get(value) + 1);
        }
        // create the sorted array from the frequencies
        List<Integer> res = new ArrayList<>(Collections.nCopies(arr.size(), null));
        int position = 0;
        for (int i = 0; i < frequencies.size(); i++) {
            int frequency = frequencies.get(i);
            for (int j = position; j < frequency + position; j++) {
                res.set(j, i);
            }
            position += frequency;
        }
        return res;
    }
}
