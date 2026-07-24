package com.ttetrafon;

public class Main {
  public static void main(String[] args) {
    CryptoManager3DES cryptoManager = new CryptoManager3DES();
    try {
      String initial = "1234567880000000";
      System.out.println("initial: " + initial);
      String secret = cryptoManager.encrypt(initial);
      System.out.println("secret: " + secret);
      String open = cryptoManager.decrypt(secret);
      System.out.println("open: " + open);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
