package com.ttetrafon.demo.wiremock;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.WireMockServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class WiremockHelper {

  @Autowired public ObjectMapper objectMapper;

  private final WireMockServer wireMockServer;

  public WiremockHelper() {
    this.wireMockServer = new WireMockServer(WiremockPortTestConfig.WIRE_MOCK_PORT);
  }

  public void startServer() {
    log.info(" ---- Starting WireMock on port {} ----", WiremockPortTestConfig.WIRE_MOCK_PORT);
    wireMockServer.start();
  }

  public WireMockServer wireMockServer() {
    return wireMockServer;
  }

  public void stopServer() {
    wireMockServer.stop();
  }

  public void resetCounts() {
    wireMockServer.resetRequests();
  }
}
