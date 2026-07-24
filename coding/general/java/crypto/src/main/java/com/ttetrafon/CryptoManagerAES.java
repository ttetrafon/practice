package com.ttetrafon;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Base64;

public class CryptoManagerAES {
  private final String KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef";
  private final String ALGORITHM = "AES";
  private final String TRANSFORMATION = ALGORITHM + "/ECB/NoPadding";

  public String encrypt(String data) throws Exception {
    System.out.println("---> encrypt()");
    byte[] key = KEY.getBytes(); // hexStringToByteArray(KEY);
    System.out.println("key: " + Arrays.toString(key));
    SecretKeySpec secretKeySpec = new SecretKeySpec(key, ALGORITHM);
    Cipher cipher = Cipher.getInstance(TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
    byte[] dataBytes = hexStringToByteArray(data);
    System.out.println("data (bytes): " + Arrays.toString(dataBytes));
    byte[] hidden = cipher.doFinal(dataBytes);
    System.out.println("hidden: " + Arrays.toString(hidden));
    byte[] original = Base64.getEncoder().encode(hidden);
    return new String(original);
  }

  public String decrypt(String data) throws Exception {
    System.out.println("---> decrypt()");
    SecretKeySpec secretKeySpec = new SecretKeySpec(KEY.getBytes(), ALGORITHM);
    Cipher cipher = Cipher.getInstance(TRANSFORMATION);
    cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
    byte[] original = cipher.doFinal(Base64.getDecoder().decode(data.getBytes()));
    return new String(original).trim();
  }

  public byte[] hexStringToByteArray(String s) {
    int len = s.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
          + Character.digit(s.charAt(i+1), 16));
    }
    return data;
  }
}
