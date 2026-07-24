package com.ttetrafon.runnables;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;

public class RunnablePractice {
  private final Queue<String> messages;
  private final Queue<Runnable> commands;

  public RunnablePractice() {
    messages = new LinkedList<>();
    commands = new LinkedList<>();
    setup();
    runNextCommand();
  }

  private void setup() {
    messages.offer("Message 1");
    messages.offer("Message 2");
    messages.offer("Message 3");
    messages.offer("Message 4");
    messages.offer("Message 5");

    while(!messages.isEmpty()) {
      commands.offer(writeCommand(messages.poll()));
    }
  }

  private Runnable writeCommand(String message) {
    System.out.println("set::writeCommand(" + message + ")");
    return () -> {
      System.out.println("---> writeCommand(" + message + ")");
      System.out.println("This is a message: " + message);
    };
  }

  private void runNextCommand() {
    System.out.println("---> runNextCommand()");
    System.out.println("remaining commands: " + commands.size());
    if (commands.isEmpty()) {
      System.out.println("... finished");
      return;
    }

    Timer timer = new Timer();
    TimerTask action = new TimerTask() {
      @Override
      public void run() {
        commands.poll().run();
        runNextCommand();
      }
    };
    timer.schedule(action, 500);
  }
}
