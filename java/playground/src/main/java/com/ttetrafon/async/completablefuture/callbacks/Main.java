package com.ttetrafon.async.completablefuture.callbacks;

public class Main {
  public void doAsyncTask(Callback callback) {
    System.out.println("... doing stuff in the async function");
    callback.onCallback();
  }
}
