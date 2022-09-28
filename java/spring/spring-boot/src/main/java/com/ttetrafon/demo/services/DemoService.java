package com.ttetrafon.demo.services;

import com.ttetrafon.demo.models.builders.DemoResponseObjectBuilder;
import com.ttetrafon.demo.models.requessts.DemoRequestObject;
import com.ttetrafon.demo.models.responses.DemoResponseObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class DemoService {

    public DemoResponseObject handleDemoRequest(HttpHeaders headers, UUID id, DemoRequestObject request) {
        log.info("request data: {}, {}, {}", headers, id, request);

        return DemoResponseObjectBuilder.buildDemoResponse(request);
    }


}
