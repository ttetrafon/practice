package com.ttetrafon.async.completablefuture.computablefutures;

import java.util.concurrent.CompletableFuture;

public class Main {
  public void doAsyncTask() {
    CompletableFuture<Void> future = new CompletableFuture<>();

    CompletableFuture<Void> future2 = future
        .whenComplete((res, exc) -> {
              System.out.println("inside handle...");
              if (exc != null) {
                System.out.println("exception...");
              }
              System.out.println("completed...");
            }
        );

    future.completeExceptionally(new Exception("exception"));

    System.out.println("--- --- ---");
    System.out.println(future.isDone());
    System.out.println(future2.isDone());
    System.out.println(future.isCompletedExceptionally());
    System.out.println(future2.isCompletedExceptionally());
  }
}
