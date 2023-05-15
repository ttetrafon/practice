package com.ttetrafon;

import java.io.BufferedWriter;

public class Logger {
  private static BufferedWriter WRITER;
  private static final int LOG_LEVEL = 3;

  public static void configure(String log_filepath, int log_level) {}

  public static void start() {
    WRITER = FileUtility.openOutputStream("test.log");
    try {
      WRITER.write("Logger Started");
      WRITER.newLine();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static void stop() {
    try {
      WRITER.newLine();
      WRITER.flush();
      WRITER.close();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static void error(String message) {
    log(6, message);
  }
  public static void warn (String message) {
    log(5, message);
  }
  public static void info(String message) {
    log(4, message);
  }
  public static void debug(String message) {
    log(3, message);
  }
  private static void log(int log_level, String message) {
    if (log_level < LOG_LEVEL) {
      return;
    }
    try {
      WRITER.write(message);
      WRITER.newLine();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }
}
