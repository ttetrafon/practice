package com.ttetrafon;

import reactor.core.publisher.Flux;
import rx.Observable;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@org.springframework.stereotype.Service
public class Service {
    private final List<String> bookTitles = List.of("Book1", "Book2", "Book3", "Book4");

    public Observable<Book> getBookStreamRxJava() {
        return Observable.interval(1, TimeUnit.SECONDS)
                .map(i -> new Book(bookTitles.get(new Random().nextInt(4))));
    }

    public Flux<Book> getBookStreamReactor() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(i -> new Book(bookTitles.get(new Random().nextInt(4))));
    }
}
