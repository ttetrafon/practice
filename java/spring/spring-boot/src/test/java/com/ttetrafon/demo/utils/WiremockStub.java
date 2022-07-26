package com.ttetrafon.demo.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpMethod;

@Data
@AllArgsConstructor
public class WiremockStub {
  private HttpMethod httpMethod;
  private String url;
  private int status;
  private String response;

  public WiremockStub(String url, int status, String response) {
    this.url = url;
    this.status = status;
    this.response = response;
  }
}
