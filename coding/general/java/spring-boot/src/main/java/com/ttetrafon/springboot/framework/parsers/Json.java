package com.ttetrafon.springboot.framework.parsers;

import java.lang.reflect.Field;
import java.util.Collection;

// Custom JSON serializer built with pure reflection — no Jackson, no Gson, no external libs.
// This is essentially what libraries like Jackson do under the hood, but simplified.
public class Json {

    // Converts any Java object into a JSON string.
    // Handles: null, String, numbers, booleans, collections (List/Set), and POJOs/records.
    public static String toJson(Object obj) {
        // null becomes the JSON literal "null"
        if (obj == null) {
            return "null";
        }
        // Strings get wrapped in quotes with special characters escaped
        if (obj instanceof String s) {
            return "\"" + escape(s) + "\"";
        }
        // Numbers and booleans are written as-is (no quotes)
        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }
        // Collections (List, Set, etc.) become JSON arrays: [item1, item2, ...]
        if (obj instanceof Collection<?> collection) {
            return collectionToJson(collection);
        }
        // Everything else (POJOs, records) — use reflection to read fields
        return objectToJson(obj);
    }

    // Serializes a POJO/record to JSON using reflection.
    // Reads every declared field, gets its value, and recursively converts to JSON.
    private static String objectToJson(Object obj) {
        StringBuilder sb = new StringBuilder("{");
        // getDeclaredFields() returns ALL fields in this class (including private ones)
        Field[] fields = obj.getClass().getDeclaredFields();
        boolean first = true;
        for (Field field : fields) {
            // setAccessible(true) bypasses the "private" modifier so we can read the field
            field.setAccessible(true);
            try {
                // Read the field's value from the object
                Object value = field.get(obj);
                if (!first) sb.append(","); // Add comma separator between fields
                // Write "fieldName":value
                sb.append("\"").append(field.getName()).append("\":");
                sb.append(toJson(value)); // Recursively convert the value to JSON
                first = false;
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        sb.append("}");
        return sb.toString();
    }

    // Serializes a Collection (List, Set, etc.) to a JSON array.
    // Example: List.of("a", "b") → ["a","b"]
    private static String collectionToJson(Collection<?> collection) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (Object item : collection) {
            if (!first) sb.append(",");
            sb.append(toJson(item)); // Recursively convert each item
            first = false;
        }
        sb.append("]");
        return sb.toString();
    }

    // Escapes special characters for JSON output.
    // Backslashes, quotes, newlines, carriage returns, and tabs all need escaping.
    private static String escape(String s) {
        return s.replace("\\", "\\\\")   // \ → \\
                .replace("\"", "\\\"")    // " → \"
                .replace("\n", "\\n")     // newline → \n
                .replace("\r", "\\r")     // carriage return → \r
                .replace("\t", "\\t");    // tab → \t
    }
}
