package com.ttetrafon;

import java.util.*;

public class InputFileContents {
  private final List<String> columns;
  private final List<Map<String, String>> data;
  private final Map<String, List<Map<String, String>>> sheetData;

  public InputFileContents() {
    this.columns = new ArrayList<>();
    this.data = new ArrayList<>();
    this.sheetData = new HashMap<>();
  }
  public InputFileContents(Set<String> sheets) {
    this.columns = new ArrayList<>();
    this.data = new ArrayList<>();
    this.sheetData = new HashMap<>();
    for (String sheet : sheets) {
      this.sheetData.put(sheet, new ArrayList<>());
    }
  }

  public List<String> getColumns() {
    return columns;
  }
  public void addColumnName(String columnName) {
    this.columns.add(columnName);
  }

  public List<Map<String, String>> getData() {
    return data;
  }
  public void addDatum(Map<String, String> datum) {
    this.data.add(datum);
  }

  public Map<String, List<Map<String, String>>> getSheetData() {
    return sheetData;
  }
  public void addSheetDatum(String sheet, Map<String, String> datum) {
//    System.out.println("---> addSheetDatum(" + sheet + ", Map<String, String> datum)");
    sheetData.get(sheet).add(datum);
  }
}
