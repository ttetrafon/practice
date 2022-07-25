package com.ttetrafon.demo.models.builders;

import com.ttetrafon.demo.models.requessts.DemoRequestObject;
import com.ttetrafon.demo.models.responses.DemoResponseObject;
import lombok.experimental.UtilityClass;

@UtilityClass
public class DemoResponseObjectBuilder {
    public DemoResponseObject buildDemoResponse(DemoRequestObject requestObject) {
        return DemoResponseObject.builder()
                .property3(requestObject.getProperty1() + "-" + requestObject.getProperty1())
                .property4(requestObject.getProperty2() * 10)
                .build();
    }
}
