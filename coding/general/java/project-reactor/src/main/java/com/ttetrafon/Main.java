package com.ttetrafon;

import reactor.core.publisher.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");

        Flux<Integer> numbers = Flux.just(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
        numbers.subscribe(System.out::println);

        Mono<String> singleValue = Mono.just("Hello from Reactor");
        singleValue.subscribe(System.out::println);

        Flux.range(1, 10).map(x -> x + " -> " + x * x).subscribe(System.out::println);
    }
}
