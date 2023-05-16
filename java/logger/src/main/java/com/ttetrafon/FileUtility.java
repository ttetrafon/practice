package com.ttetrafon;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class FileUtility {
  public static BufferedWriter openOutputStream(String filename) {
    BufferedWriter bw = null;
    try {
      String path = "D:\\OneDrive\\Documents\\self-practice\\java\\logger\\output\\";
      File dir = new File(path);
      boolean dirExists = dir.exists();
      if (!dirExists) {
        dirExists = dir.mkdir();
      }
      File file = new File(path + filename);
      boolean fileExists = file.exists();
      if (dirExists && !fileExists) {
        fileExists = file.createNewFile();
      }
      if (fileExists) {
        FileWriter fw = new FileWriter(file, true);
        bw = new BufferedWriter(fw);
      }
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
    return bw;
  }
}
