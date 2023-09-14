package com.ttetrafon.cryptooperations;

import android.content.Context;
import android.os.Environment;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Properties;

public class FileUtility {
  public static int READ_BLOCK_SIZE = 256;

  public static OutputStreamWriter openOutputStream(String filename, boolean append) {
    OutputStreamWriter osw = null;
    try {
      String path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/cccterminal/log/";
      File dir = new File(path);
      boolean dirExists = dir.exists();
      if (!dirExists) {
        dirExists = dir.mkdir();
      }
      File file = new File(path, filename);
      boolean fileExists = file.exists();
      if (dirExists && !fileExists) {
        fileExists = file.createNewFile();
      }
      if (fileExists) {
        FileOutputStream fw = new FileOutputStream(file, append);
        osw = new OutputStreamWriter(fw);
      }
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
    return osw;
  }

  public static Properties readPropertiesFile(String filename) {
    Properties res = new Properties();
    try {
      File file = new File(Environment.getExternalStorageDirectory().getAbsolutePath(),
          "/cccterminal/properties/" + filename);
      if (!file.exists()) {
        return res;
      }
      FileInputStream fis = new FileInputStream(file);
      InputStreamReader reader = new InputStreamReader(fis);
      res.load(reader);
      reader.close();
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    return res;
  }

  public static Properties readStateFile(Context context) {
    Properties res = new Properties();
    try {
      File dir = new File(context.getFilesDir().toURI());
      boolean dirExists = dir.exists();
      if (!dirExists) {
        dirExists = dir.mkdir();
      }
      if (!dirExists) {
        return null;
      }
      File stateFile = new File(dir, "state.properties");
      if (!stateFile.exists()) {
        return null;
      }
      FileInputStream fis = new FileInputStream(stateFile);
      InputStreamReader reader = new InputStreamReader(fis);
      res.load(reader);
      reader.close();
      return res;
    }
    catch (Exception exc) {
      exc.printStackTrace();
      return null;
    }
  }

  public static void saveStateFile(Context context, Properties state) {
    try {
      File dir = new File(context.getFilesDir().toURI());
      boolean dirExists = dir.exists();
      if (!dirExists) {
        dirExists = dir.mkdir();
      }
      if (dirExists) {
        File stateFile = new File(dir, "state.properties");
        FileWriter fw = new FileWriter(stateFile);
        fw.append(state.toString());
        fw.flush();
        fw.close();
      }
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static void saveAppFile(Context context, String filename, String contents) {
    try {
      File out = new File(context.getFilesDir(), filename);
      FileWriter fw = new FileWriter(out);
      // TODO: encrypt the contents here
      fw.append(contents);
      fw.flush();
      fw.close();
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
  }

  public static String loadAppFile(Context context, String filename) {
    StringBuilder res = new StringBuilder();
    try {
      File file = new File(context.getFilesDir(), filename);
      if (!file.exists()) {
        return null;
      }
      FileInputStream fis = new FileInputStream(file);
      InputStreamReader reader = new InputStreamReader(fis);
      char[] inputBuffer = new char[READ_BLOCK_SIZE];
      int charRead;
      while ((charRead = reader.read(inputBuffer)) > 0) {
        res.append(String.copyValueOf(inputBuffer, 0, charRead));
      }
      reader.close();
      // TODO: decrypt the contents here
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }
    return res.toString();
  }
}
