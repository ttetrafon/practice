package com.ttetrafon;

import org.json.JSONObject;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");

    JSON json = new JSON();
    System.out.println(json.createNestedJsonObject());
  }
}
