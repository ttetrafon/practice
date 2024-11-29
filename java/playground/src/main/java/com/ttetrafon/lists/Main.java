package com.ttetrafon.lists;

import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Cover> outer = List.of(
                new Cover(List.of(1, 2)),
                new Cover(List.of(3, 4, 5))
        );
        List<Integer> res = outer.stream()
                .flatMap(c -> c.list.stream())
                .collect(Collectors.toList());
        System.out.println(res);
    }
}
