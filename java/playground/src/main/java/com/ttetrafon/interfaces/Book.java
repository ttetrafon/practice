package com.ttetrafon.interfaces;

public interface Book {
    String id();
    String title();
    String author();

    interface WithBookcase extends Book {
        Bookcase atBookcase(String bookcaseId);
    }

    interface WithBorrower extends Book {
        Borrower atBorrower(String name);
    }
}
