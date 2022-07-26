package com.ttetrafon.demo.wiremock;

import java.util.Random;

public class WiremockPortTestConfig {

  public static final int WIRE_MOCK_PORT = wireMockPort();

  private static int wireMockPort() {
    Random random = new Random();
    return random.nextInt(1000) + 8000;
  }
}
