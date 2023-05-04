package com.ttetrafon.read_write_files.helper;

import android.Manifest;
import android.content.Context;
import android.os.Environment;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.ttetrafon.read_write_files.R;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

public class FileUtility {

    public static void readFileContents(Context context, String directory, String filename) {
        Log.println(Log.DEBUG, String.valueOf(R.string.logger), "---> readFileContents(" + directory + ", " + filename + ")");

        File fileDirectory = new File(Environment.getExternalStorageDirectory() + "/" + directory + "/");
        File[] dirFiles = fileDirectory.listFiles();

        if (dirFiles != null) {
            for (File dirFile : dirFiles) {
                Log.println(Log.DEBUG, String.valueOf(R.string.logger), dirFile.toString());

            }
        }

//        try(FileInputStream fis = new FileInputStream(Environment.getExternalStorageDirectory() + "/" + directory + "/" + filename)) {
//            InputStreamReader isr = new InputStreamReader(fis);
//            BufferedReader bufferedReader = new BufferedReader(isr);
//            StringBuilder sb = new StringBuilder();
//            String line;
//            while ((line = bufferedReader.readLine()) != null) {
//                sb.append(line);
//            }
//        }
//        catch (Exception exc) {
//            exc.printStackTrace();
//        }
    }
}
