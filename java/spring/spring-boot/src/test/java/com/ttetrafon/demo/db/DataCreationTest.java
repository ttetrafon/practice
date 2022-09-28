package com.ttetrafon.demo.db;

import com.ttetrafon.demo.entities.BookEntity;
import com.ttetrafon.demo.services.BookService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DataCreationTest {

    @Autowired
    private BookService bookService;

    @Test
    public void importBooksAtStartup() {
        List<BookEntity> books = bookService.listBooks();

        Assert.assertEquals(books.size(), 3);
    }
}
