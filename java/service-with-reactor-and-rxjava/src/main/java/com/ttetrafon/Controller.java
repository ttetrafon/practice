package com.ttetrafon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import rx.Observable;

@RestController
public class Controller {
    @Autowired
    private final Service bookService;

    public Controller(Service bookService) {
        this.bookService = bookService;
    }

    @GetMapping(value = "/reactor", produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
    public Flux<Book> getBooksReactor() {
        return bookService.getBookStreamReactor();
    }

    @GetMapping(value = "/rxjava", produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
    public Observable<Book> getBooksRxJava() {
        return bookService.getBookStreamRxJava();
    }
}
