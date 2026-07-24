package com.ttetrafon;

import org.junit.Test;

import java.nio.charset.Charset;

import static org.junit.Assert.assertArrayEquals;

public class RepresentationTests {

  @Test
  public void compareAsciiAndHexByteArrays() {
    String ascii = "This is some text!";
    String hex = Convert.asciiToHex(ascii);

    byte[] bAscii = ascii.getBytes(Charset.defaultCharset());
    byte[] bHex = Convert.hexStringToByteArray(hex);

    assertArrayEquals(bAscii, bHex);
  }

}
