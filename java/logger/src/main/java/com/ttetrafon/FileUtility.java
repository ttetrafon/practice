package com.ttetrafon;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;

public class FileUtility {
  public static BufferedWriter openOutputStream(String filename) {
    BufferedWriter bw = null;
    try {
      File file = new File("D:\\OneDrive\\Documents\\self-practice\\java\\logger\\" + filename);
      boolean fileExists = file.exists();
      if (!fileExists) {
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
