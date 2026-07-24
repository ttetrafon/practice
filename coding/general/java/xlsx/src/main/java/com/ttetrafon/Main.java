package com.ttetrafon;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");

    String folder = "D:\\OneDrive\\Documents\\self-practice\\java\\xlsx\\src\\main\\resources\\";
    String file = "data.xlsx";
    Map<String, List<String>> names = new HashMap<>();
    List<String> columnNames1 = List.of("Name", "Email", "Occupation", "Net Worth");
    String pageName1 = "users";
    names.put(pageName1, columnNames1);
    List<String> columnNames2 = List.of("Name", "Address", "Tel");
    String pageName2 = "locations";
    names.put(pageName2, columnNames2);

    try {
      InputFileContents inputFileContents = FileUtility.readXmlLinesFroGivenSheetsAndColumns(true, folder, file, names);
      List<Map<String, String>> lines = inputFileContents.getSheetData().get(pageName1);
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }
}
