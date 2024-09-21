package com.ttetrafon.hackerrank;

import java.util.ArrayList;
import java.util.List;

public class LonelyInteger {
    public static int lonelyInteger(List<Integer> a) {
        // [1 2 3 4 3 2 1] -> 4
        // [0 0 1 2 1] -> 2
        List<Integer> alreadyFound = new ArrayList<>();
        for (int i = 0; i < a.size(); i++) {
            if (alreadyFound.contains(a.get(i))) {
                continue;
            }
            boolean found = false;
            for (int j = i + 1; j < a.size(); j++) {
                if (a.get(i).equals(a.get(j))) {
                    alreadyFound.add(a.get(i));
                    found = true;
                    break;
                }
            }
            if (!found) {
                return a.get(i);
            }
        }
        return -1;
    }
}
