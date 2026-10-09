package com.ttetrafon.vectorpractice;

import jdk.incubator.vector.IntVector;
import jdk.incubator.vector.VectorSpecies;

public class VectorPractice {
    static final VectorSpecies<Integer> SPECIES = IntVector.SPECIES_64;

    public static void run() {
        int[] a = {1, 2, 3, 4};
        int[] b = {5, 6, 1, 3};
        int[] result = new int[4];

        if (a.length >= SPECIES.length() && b.length >= SPECIES.length()) {
            var va = IntVector.fromArray(IntVector.SPECIES_64, a, 0);
            var vb = IntVector.fromArray(IntVector.SPECIES_64, b, 0);

            va.add(vb).intoArray(result, 0);
            // FIXME: the result is not correct... investigate how the Vector module actually works!

            System.out.println(java.util.Arrays.toString(result));
        }
        else {
            System.out.println("Array length is smaller than vector species length");
        }
    }
}
