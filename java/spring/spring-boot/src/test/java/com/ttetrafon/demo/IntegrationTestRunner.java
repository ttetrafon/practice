package com.ttetrafon.demo;

import com.github.tomakehurst.wiremock.stubbing.StubMapping;
import com.ttetrafon.demo.utils.WiremockStub;
import com.ttetrafon.demo.wiremock.WiremockHelper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

@SpringBootTest(classes = DemoApplication.class)
@TestPropertySource("classpath:application-test.yaml")
@AutoConfigureMockMvc
@DirtiesContext
// Keep the tests in method scope, so that stubs and information do not get mixed up.
@TestInstance(TestInstance.Lifecycle.PER_METHOD)
@ActiveProfiles("test")
@Slf4j
public class IntegrationTestRunner {
  @Autowired public WiremockHelper wiremockHelper;
  @Autowired public MockMvc mockMvc;

  @BeforeAll
  public void init() {
    wiremockHelper.startServer();
  }

  @BeforeEach
  public void setup() {
    wiremockHelper.resetCounts();
  }

  @AfterAll
  public void clean() {
    wiremockHelper.stopServer();
  }

  public List<StubMapping> showStubs() {
    return wiremockHelper.wireMockServer().getStubMappings();
  }


}
