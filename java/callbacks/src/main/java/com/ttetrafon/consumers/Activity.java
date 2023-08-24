package com.ttetrafon.consumers;

public class Activity {
  private final Task task;

  public Activity() {
    this.task = new Task(this::stateUpdate);
    this.task.start();
  }

  private void stateUpdate(int newState) {
    System.out.println("---> stateUpdate(" + newState + ")");
    switch (newState) {
      case 1:
        task.process();
        break;
      case 2:
        task.finish();
        break;
      default:
        break;
    }
  }

}
