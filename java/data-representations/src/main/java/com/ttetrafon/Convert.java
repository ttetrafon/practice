package com.ttetrafon;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.StringUtils;

public class Convert {
  public static String bcdToStr(byte[] b) throws IllegalArgumentException {
    char[] HEX_DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
    StringBuilder sb = new StringBuilder(b.length * 2);
    for (byte value : b) {
      sb.append(HEX_DIGITS[(value & 0xf0) >>> 4]);
      sb.append(HEX_DIGITS[value & 0x0f]);
    }
    return sb.toString();
  }

  public static byte[] strToBcd(String str, PaddingPosition paddingPosition) throws IllegalArgumentException {
    if (str == null || paddingPosition == null) {
      throw new IllegalArgumentException("strToBcd input arg is null");
    }
    int len = str.length();
    int mod = len % 2;
    if (mod != 0) {
      if (paddingPosition == PaddingPosition.RIGHT) {
        str = str + "0";
      } else {
        str = "0" + str;
      }
      len = str.length();
    }
    byte abt[] = new byte[len];
    if (len >= 2) {
      len = len / 2;
    }
    byte bbt[] = new byte[len];
    abt = str.getBytes();
    int j, k;
    for (int p = 0; p < str.length() / 2; p++) {
      if ((abt[2 * p] >= 'a') && (abt[2 * p] <= 'z')) {
        j = abt[2 * p] - 'a' + 0x0a;
      } else if ((abt[2 * p] >= 'A') && (abt[2 * p] <= 'Z')) {
        j = abt[2 * p] - 'A' + 0x0a;
      } else {
        j = abt[2 * p] - '0';
      }

      if ((abt[2 * p + 1] >= 'a') && (abt[2 * p + 1] <= 'z')) {
        k = abt[2 * p + 1] - 'a' + 0x0a;
      } else if ((abt[2 * p + 1] >= 'A') && (abt[2 * p + 1] <= 'Z')) {
        k = abt[2 * p + 1] - 'A' + 0x0a;
      } else {
        k = abt[2 * p + 1] - '0';
      }

      int a = (j << 4) + k;
      byte b = (byte) a;
      bbt[p] = b;
    }
    return bbt;
  }

  public static String asciiToHex(String asciiStr) {
    char[] chars = asciiStr.toCharArray();
    StringBuilder hex = new StringBuilder();
    for (char ch : chars) {
      hex.append(Integer.toHexString((int) ch));
    }
    return hex.toString();
  }

  public static String hexToAscii(String hexStr) {
    StringBuilder output = new StringBuilder("");
    for (int i = 0; i < hexStr.length(); i += 2) {
      String str = hexStr.substring(i, i + 2);
      if (str.equals("00")) {
        continue;
      }
      output.append((char) Integer.parseInt(str, 16));
    }
    return output.toString();
  }

  public static byte[] hexStringToByteArray(String s) { // TODO: replace with strToBcd!
    int len = s.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
          + Character.digit(s.charAt(i+1), 16));
    }
    return data;
  }

  public static String byteArrayToHexString(byte[] byteArray) { // TODO: replace with bcdToStr!
    StringBuffer hexStringBuffer = new StringBuffer();
    for (int i = 0; i < byteArray.length; i++) {
      hexStringBuffer.append(byteToHex(byteArray[i]));
    }
    return hexStringBuffer.toString();
  }

  private static String byteToHex(byte num) {
    char[] hexDigits = new char[2];
    hexDigits[0] = Character.forDigit((num >> 4) & 0xF, 16);
    hexDigits[1] = Character.forDigit((num & 0xF), 16);
    return new String(hexDigits);
  }

  public static byte[] base64ToByteArray(String base64) {
    return new org.apache.commons.codec.binary.Base64().decode(StringUtils.getBytesUtf8(base64));
  }

  public static String byteArrayToBase64(byte[] bytes) {
    return new String(Base64.encodeBase64(bytes));
  }
}
