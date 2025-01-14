package com.ttetrafon.jackson;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Main {
    public static void main(String[] args) {

        TestClass obj = new TestClass();
        obj.name = "ttetrafon";

        ObjectMapper mapper = new ObjectMapper();
        mapper.addMixIn(TestClass.class, TestClassMixin.class);

        try {
            String json = mapper.writeValueAsString(obj);
            System.out.println(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        String serialisedObject = "{\"name\":\"ttetrafon\",\"age\":20}";
        try {
            TestClass deserializedObj = mapper.readValue(serialisedObject, TestClass.class);
            System.out.println("deserializedObj: " + deserializedObj.toString());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
