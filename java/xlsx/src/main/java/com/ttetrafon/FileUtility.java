package com.ttetrafon;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class FileUtility {
  public static InputFileContents readXmlLinesFroGivenSheetsAndColumns(Boolean localTesting, String srcBucket, String srcKey,
                                                                       Map<String, List<String>> sheetsAndColumnNames
      /* 'N/A' means we don't care about the sheet name, just grab the first one */) throws Exception {
    // Get the file.
    Workbook workbook;
    FileInputStream file = new FileInputStream(new File(Paths.get(srcBucket + srcKey).toUri()));
    workbook = new XSSFWorkbook(file);

    Set<String> sheets = sheetsAndColumnNames.keySet();
    InputFileContents res = new InputFileContents(sheets);
    for (String sheetName : sheets) {
//      System.out.println("... sheet name: " + sheetName);
      List<String> columnNames = sheetsAndColumnNames.get(sheetName);

      Sheet sheet;
      if (sheetName.equals("N/A")) {
        sheet = workbook.getSheetAt(0);
      }
      else {
        sheet = workbook.getSheet(sheetName);
      }
      if (sheet == null) {
        throw new Exception("EXCEL SHEET (" + (sheetName.equals("N/A") ? "" : sheetName) + ") NOT FOUND");
      }

      // Get the first row to find the columns we need
      Map<String, Integer> columnIndices = new HashMap<>();
      Row firstRow = sheet.getRow(0);
      for (Cell cell : firstRow) {
        cell.setCellType(CellType.STRING);
        String columnName = cell.getStringCellValue();
        res.addColumnName(columnName);
        if (columnNames.contains(columnName)) {
//          System.out.println("... found column '" + columnName + "' at index " + cell.getColumnIndex());
          columnIndices.put(resolveDictName(columnName), cell.getColumnIndex());
        }
      }
      if (columnNames.size() != columnIndices.size()) {
        throw new Exception("NOT ALL REQUIRED COLUMNS FOUND");
      }

      // Read the rest of the required data
      for (int i = 0; i <= sheet.getLastRowNum(); i++) {
//        System.out.println("-----   ROW " + (i+1) + "   -----");
        Map<String, String> lineData = new HashMap<>();
        Row row = sheet.getRow(i);
        for (int k = 0; k < columnNames.size(); k++) {
          String field = resolveDictName(columnNames.get(k));
          Integer index = columnIndices.get(field);
          Cell cell = row.getCell(index);
//          CellType cellType = cell.getCellType();
          DataFormatter df = new DataFormatter();
          String value = df.formatCellValue(cell); // = cell.getStringCellValue();
//          if (cellType.equals(CellType.NUMERIC)) {
//
////            Date num = cell.getDateCellValue();
//            value = "...";
//          }
//          else if (cellType.equals(CellType.STRING)) {
//            value = cell.getStringCellValue();
//          }
//          else {
//            cell.setCellType(CellType.STRING);
//            value = cell.getStringCellValue();
//          }
//          System.out.println(field + " [" + cellType + "]: " + value);
          lineData.put(field, value);
        }
        res.addSheetDatum(sheetName, lineData);
      }
    }

    workbook.close();
    return res;
  }

  public static String resolveDictName(String name) {
    return name.replaceAll(" ", "_");
  }
}
