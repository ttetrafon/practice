package com.ttetrafon;

import org.json.JSONObject;

public class JSON {


  public JSONObject createNestedJsonObject() {
    JSONObject jsonObject = new JSONObject();

    JSONObject jsonObjectInner = new JSONObject();
    jsonObjectInner.put("key1", "value1");
    jsonObjectInner.put("key2", "value2");
    jsonObjectInner.put("key3", "value3");

    jsonObject.put("inner", jsonObjectInner);
    jsonObject.put("version", 142);

    return jsonObject;
  }

}
