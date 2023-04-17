package com.example.receive_intent;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    Log.println(Log.DEBUG, String.valueOf(R.string.log_tag), "MainActivity.onCreate started!");
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    MainActivity.this.moveTaskToBack(true);

    Intent incomingIntent = getIntent();
    String intentType = incomingIntent.getType();
    Log.println(Log.DEBUG, String.valueOf(R.string.log_tag), "intent type: " + intentType);
    Log.println(Log.DEBUG, String.valueOf(R.string.log_tag), "MainActivity.onCreate finished!");
  }
}
