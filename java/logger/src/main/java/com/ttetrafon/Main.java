package com.ttetrafon;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");

    Logger.start();
    Logger.error("... error");
    Logger.warn("... warning");
    Logger.info("... info");
    Logger.debug("... debugging");
    Logger.stop();
  }
}
