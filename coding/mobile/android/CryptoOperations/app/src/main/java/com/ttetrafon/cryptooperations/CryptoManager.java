package com.ttetrafon.cryptooperations;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class CryptoManager {
  public static final String ALGORITHM_3DS = "DESede";
  public static final String TRANSFORMATION_3DS = ALGORITHM_3DS + "/ECB/NoPadding";
  private static final String ALGORITHM_AES = "AES";
  private static final String TRANSFORMATION_AES = ALGORITHM_AES + "/ECB/NoPadding";

  public static byte[] encryptAes(byte[] key, byte[] data) {
    return encrypt(CryptoManager.ALGORITHM_AES, CryptoManager.TRANSFORMATION_AES, key, data);
  }
  public static byte[] encrypt3ds(byte[] key, byte[] data) {
    return encrypt(CryptoManager.ALGORITHM_3DS, CryptoManager.TRANSFORMATION_3DS, key, data);
  }
  private static byte[] encrypt(String algorithm, String transformation, byte[] key, byte[] data) {
//    Logger.debug("---> encrypt()");
    try {
      byte[] k = algorithm.equals(CryptoManager.ALGORITHM_3DS) ? prepKey(key) : key;
//      Logger.debug("key: " + Arrays.toString(k) + " (length=" + k.length + ")");
      SecretKeySpec secretKeySpec = new SecretKeySpec(k, algorithm);
      Cipher cipher = Cipher.getInstance(transformation);
      cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
//      Logger.debug("data: " + data + " (length=" + data.length + ")");
//      byte[] dataBytes = Convert.hexStringToByteArray(data);
//      Logger.debug("data (bytes): " + Arrays.toString(data));
      byte[] hidden = cipher.doFinal(data);
//      Logger.debug("hidden: " + Arrays.toString(hidden));
      return hidden;
    }
    catch (Exception exc) {
      exc.printStackTrace();
      return new byte[8];
    }
  }

  private static byte[] encryptpcid(String algorithm, String transformation, byte[] key, String data) {
//    Logger.debug("---> encrypt()");
    try {
      byte[] k = algorithm.equals(CryptoManager.ALGORITHM_3DS) ? prepKey(key) : key;
//      Logger.debug("key: " + Arrays.toString(k) + " (length=" + k.length + ")");
      SecretKeySpec secretKeySpec = new SecretKeySpec(k, algorithm);
      Cipher cipher = Cipher.getInstance(transformation);
      cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
//      Logger.debug("data: " + data + " (length=" + data.length() + ")");
      byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
//      Logger.debug("data pcid (bytes): " + Arrays.toString(dataBytes));
      byte[] hidden = cipher.doFinal(dataBytes);
//      Logger.debug("hidden pcid: " + Arrays.toString(hidden));
      return hidden;
    }
    catch (Exception exc) {
      exc.printStackTrace();
      return new byte[8];
    }
  }
  public static byte[] decryptAes(byte[] key, byte[] data) {
    return decrypt(ALGORITHM_AES, TRANSFORMATION_AES, key, data);
  }
  private static byte[] decrypt(String algorithm, String transformation, byte[] key, byte[] data) {
    Logger.debug("---> decrypt()");
    try {
      byte[] k = algorithm.equals(CryptoManager.ALGORITHM_3DS) ? prepKey(key) : key;
      SecretKeySpec secretKeySpec = new SecretKeySpec(k, algorithm);
      Cipher cipher = Cipher.getInstance(transformation);
      cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
      return cipher.doFinal(data);
    }
    catch (Exception exc) {
      exc.printStackTrace();
      return data;
    }
  }

  private static byte[] prepKey(byte[] key) {
    // adjust the length of the key for 3DS
    int len = key.length;
    if (len < 24) {
      byte[] k = new byte[24];
      for (int i = 0; i < len; i++) {
        k[i] = key[i];
        if (i < 8) {
          k[i + 16] = k[i];
        }
      }
      return k;
    }
    else {
      return key;
    }
  }
}
