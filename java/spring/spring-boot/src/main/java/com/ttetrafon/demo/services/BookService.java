package com.ttetrafon.demo.services;

import com.ttetrafon.demo.entities.BookEntity;
import com.ttetrafon.demo.repositories.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BookService {

    @Autowired private final BookRepository bookRepository;

    public List<BookEntity> listBooks() {
        return bookRepository.findAll();
    }
}
