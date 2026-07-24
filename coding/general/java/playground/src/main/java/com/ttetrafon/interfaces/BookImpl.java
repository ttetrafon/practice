package com.ttetrafon.interfaces;

public record BookImpl(String id, String title, String author) implements Book.WithBookcase, Book.WithBorrower {

    @Override
    public Bookcase atBookcase(String bookcaseId) {
        return null;
    }

    @Override
    public Borrower atBorrower(String name) {
        return null;
    }
}
