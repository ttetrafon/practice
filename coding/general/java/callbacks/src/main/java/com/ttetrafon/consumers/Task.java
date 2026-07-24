package com.ttetrafon.consumers;

import java.util.Timer;
import java.util.function.Consumer;

public class Task {
  private final Consumer<Integer> stateCallback;

  public Task(Consumer<Integer> stateCallback) {
    this.stateCallback = stateCallback;
  }

  public void start() {
    System.out.println("---> Task.start()");
    stateCallback.accept(1);
  }

  public void process() {
    System.out.println("---> Task.process()");
    stateCallback.accept(2);
  }

  public void finish() {
    System.out.println("---> Task.finish()");
  }
}
