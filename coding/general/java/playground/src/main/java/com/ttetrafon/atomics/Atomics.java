package com.ttetrafon.atomics;

import java.util.concurrent.atomic.AtomicBoolean;

public class Atomics {

    public static void main(String[] args) {
        AtomicBoolean started = new AtomicBoolean(false);

        if (started.compareAndSet(false, true)) {

        }


    }
}
