package com.ttetrafon;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;

public class HttpServer extends AbstractVerticle {
    // https://mvnrepository.com/artifact/io.vertx/vertx-core

    @Override
    public void start() {
        vertx.createHttpServer().requestHandler(req -> {
            req.response().end("Hello from a Vert.x Http Server");
        }).listen(8080);
    }

    public static void main(String[] args) {
        System.out.println("Hello world!");
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(new HttpServer());
    }
}
