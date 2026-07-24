package com.ttetrafon;

import rx.Observable;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");

        Observable<String> observable = Observable.just("Hello", "RxJava", "World");
        observable.subscribe(System.out::println);

        Observable.range(1, 10).map(x -> x + " -> " + (x * 3)).subscribe(System.out::println);
    }
}
