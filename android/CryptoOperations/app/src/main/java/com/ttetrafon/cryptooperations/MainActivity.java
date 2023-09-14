package com.ttetrafon.cryptooperations;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.util.Arrays;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            CryptoInternal.internalPrepare();
            String data = "This is some data to be encrypted. Let's see how this goes...";
//            ByteArrayOutputStream out = new ByteArrayOutputStream(10240);
//            byte[] encrypted = new byte[0];
//            encrypted = CryptoInternal.internalEncrypt(data.getBytes(), out);
//            System.out.println(Arrays.toString(encrypted));
//            System.out.println(new OutputStreamWriter(out));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}