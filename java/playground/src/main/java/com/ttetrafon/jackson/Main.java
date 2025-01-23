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

        String serialisedObject = """
                {
                    "name": "ttetrafon",
                    "age": 20,
                    "hobbies": [
                        "chess",
                        "running"
                    ]
                }
                """;
        try {
            TestClass deserializedObj = mapper.readValue(serialisedObject, TestClass.class);
            System.out.println("deserializedObj: " + deserializedObj.toString());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


        try {
            String parentStr = """
                {
                    "messageId": "12345",
                    "contents": "Hello, world!",
                    "child": {
                        "type": "childA",
                        "prop1": "Some data",
                        "prop2": 42
                     }
                 }
                """;
            mapper.addMixIn(Parent.class, ParentMixin.class);
            mapper.addMixIn(Child.class, ChildMixin.class);
            mapper.addMixIn(ChildA.class, ChildAMixin.class);
            mapper.addMixIn(ChildB.class, ChildBMixin.class);

            Parent parent = mapper.readValue(parentStr, Parent.class);
            System.out.println("parent: " + parent.toString());
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
