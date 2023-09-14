package com.ttetrafon.cryptooperations;

import android.util.Log;

import java.io.OutputStreamWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

//import com.ttetrafon.cryptooperations.BuildConfig;

public class Logger {
  private static OutputStreamWriter WRITER = null;
  private static int LOG_LEVEL = 0;
  // 0: no logging, not even the log file will be created
  // DEBUG = 3
  // INFO = 4
  // WARN = 5
  // ERROR = 6
  private static DateFormat DF;
  private static final String LOG_TAG = "planet-volt";

  public static void start(int logLevel) {
    LOG_LEVEL = logLevel;
    DF = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    if (LOG_LEVEL == 0) {
      WRITER = null;
      return;
    }
    if (WRITER != null) {
      try {
        WRITER.close();
      }
      catch (Exception e) {
        e.printStackTrace();
      }
      WRITER = null;
    }
    Date today = Calendar.getInstance().getTime();
    String filename = DF.format(today).substring(0, 10) + ".log";
    WRITER = FileUtility.openOutputStream(filename, true);

    try {
      WRITER.write(formatLine(99, "Logger started"));
//      WRITER.write(formatLine(99, "app version " + BuildConfig.VERSION_NAME));
      WRITER.flush();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static void stop() {
    if (LOG_LEVEL == 0) {
      WRITER = null;
      return;
    }
    try {
      WRITER.write(formatLine(99, "Logger stopped\n"));
      WRITER.flush();
      WRITER.close();
      WRITER = null;
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static void error(String message) {
    Log.e(LOG_TAG, message);
//    log(6, message);
  }
  public static void warn (String message) {
    Log.w(LOG_TAG, message);
//    log(5, message);
  }
  public static void info(String message) {
    Log.i(LOG_TAG, message);
//    log(4, message);
  }
  public static void debug(String message) {
    Log.d(LOG_TAG, message);
//    log(3, message);
  }
  private static void log(int logLevel, String message) {
    if (LOG_LEVEL == 0 || logLevel < LOG_LEVEL) {
      return;
    }
    try {
      WRITER.write(formatLine(logLevel, message));
      WRITER.flush();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  private static String formatLine(int logLevel, String message) {
    StringBuilder sb = new StringBuilder();
    Date now = Calendar.getInstance().getTime();
    sb.append("[").append(DF.format(now)).append("] ");
    switch (logLevel) {
      case Log.ERROR:
        sb.append("E: ");
        break;
      case Log.WARN:
        sb.append("W: ");
        break;
      case Log.INFO:
        sb.append("I: ");
        break;
      case Log.DEBUG:
      default:
        sb.append("D: ");
        break;
    }
    sb.append(message).append("\n");
    return sb.toString();
  }

  public static void setLogLevel(int logLevel) {
    LOG_LEVEL = logLevel;
  }
}
