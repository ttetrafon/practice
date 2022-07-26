package com.ttetrafon.demo.utils;

import com.github.tomakehurst.wiremock.client.ResponseDefinitionBuilder;
import com.github.tomakehurst.wiremock.matching.RequestPatternBuilder;
import org.springframework.http.MediaType;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.matching.RequestPatternBuilder.newRequestPattern;

public class WiremockUtils {

  public static RequestPatternBuilder headerMatching(String headerKey, String headerValue) {
    return newRequestPattern().withHeader(headerKey, equalTo(headerValue));
  }

  public static RequestPatternBuilder bodyMatchingJsonPath(String jsonPath, String value) {
    return newRequestPattern().withRequestBody(matchingJsonPath(jsonPath, equalTo(value)));
  }

  public static ResponseDefinitionBuilder getPartialResponseBuilder(int status, String response) {
    return aResponse()
        .withStatus(status)
        .withHeader("Content-Type", MediaType.APPLICATION_JSON.toString())
        .withBody(response);
  }
}
