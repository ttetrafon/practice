package com.ttetrafon.async.callbacks;

import com.ttetrafon.async.completablefuture.callbacks.Callback;
import com.ttetrafon.async.completablefuture.callbacks.Main;

public class Test {
  public static void main(String[] args) {
    Main main = new Main();
    main.doAsyncTask(
    new Callback() {
        @Override
        public void onCallback() {
          System.out.println("... async task finished!");
        }
      }
    );
  }
}
