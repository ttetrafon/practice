package com.ttetrafon.async.completablefuture.futures;

import java.util.concurrent.*;

public class Main {
  public void doAsyncTask() {
    ExecutorService executorService = Executors.newSingleThreadExecutor();

    Future<Integer> future = executorService.submit(new Callable<Integer>() {
      @Override
      public Integer call() throws Exception {
        return 42;
      }
    });

    System.out.println("... stuff done while the async task is executing!");

    try {
      Integer result = future.get();
      System.out.println("async result: " + result);
    }
    catch (Exception exc) {
      exc.printStackTrace();
    }

    executorService.shutdown();
  }
}
