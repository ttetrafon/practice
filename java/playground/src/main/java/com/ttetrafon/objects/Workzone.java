package com.ttetrafon.objects;

public class Workzone {
    private int count;

    public Workzone(int count) {
        this.count = count;
    }

    public int count() {
        return count;
    }

    public int incrementAndReturnCount() {
        return ++count;
    }
}
