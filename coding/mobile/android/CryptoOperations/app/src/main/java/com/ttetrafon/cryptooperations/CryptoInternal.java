package com.ttetrafon.cryptooperations;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class CryptoInternal {
    private static String internalKeyAlias = "my-app-key";
    private static KeyStore internalKeyStore;
    private static Cipher internalEncryptCypher;
    private static Cipher internalDecryptCypher;
    private static String internalTransformation;
    private static final String INTERNAL_ALGORITHM = KeyProperties.KEY_ALGORITHM_AES;
    private static final String INTERNAL_BLOCK_MODE = KeyProperties.BLOCK_MODE_CBC;
    private static final String INTERNAL_PADDING = KeyProperties.ENCRYPTION_PADDING_NONE;
    private static final Integer INTERNAL_KEY_SIZE = 256;

    public static void internalPrepare() {
        try {
            internalKeyStore = KeyStore.getInstance("AndroidKeystore");
            internalKeyStore.load(null);
             internalKeyStore.deleteEntry(internalKeyAlias);
            internalTransformation = String.join("/",
                    INTERNAL_ALGORITHM,
                    INTERNAL_BLOCK_MODE,
                    INTERNAL_PADDING);
            internalEncryptCypher = Cipher.getInstance(internalTransformation);
            internalEncryptCypher.init(Cipher.ENCRYPT_MODE, getKey());
        }
        catch (Exception exc) {
            exc.printStackTrace();
        }
    }

    private static SecretKey getKey() throws Exception {
        KeyStore.SecretKeyEntry existingKey = (KeyStore.SecretKeyEntry) internalKeyStore.getEntry(internalKeyAlias, null);
        if (existingKey == null) {
            return createKey();
        }
        else {
            return existingKey.getSecretKey();
        }
    }
    private static SecretKey createKey() throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance(INTERNAL_ALGORITHM);
        kg.init(new KeyGenParameterSpec.Builder(internalKeyAlias, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(INTERNAL_BLOCK_MODE)
                .setEncryptionPaddings(INTERNAL_PADDING)
                .setUserAuthenticationRequired(false)
                .setKeySize(INTERNAL_KEY_SIZE)
                .build());
        return kg.generateKey();
    }
    private static void storeKey() throws Exception {
        internalKeyStore.setKeyEntry(internalKeyAlias, "this is some useless key...".getBytes(), null); // FIXME...!
    }

    public static byte[] internalEncrypt(byte[] input, OutputStream outputStream) throws Exception {
        byte[] encryptedBytes = internalEncryptCypher.doFinal(input);
        outputStream.write(internalEncryptCypher.getIV().length);
        outputStream.write(internalEncryptCypher.getIV());
        outputStream.write(encryptedBytes.length);
        outputStream.write(encryptedBytes);
        outputStream.close();
        return encryptedBytes;
    }

    private static Cipher internalGetDecryptionCipherForIv(byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(internalTransformation);
        cipher.init(Cipher.DECRYPT_MODE, getKey());
        return cipher;
    }

    public static byte[] internalDecrypt(InputStream inputStream) throws Exception {
        int ivSize = inputStream.read();
        byte[] iv = new byte[ivSize];
        inputStream.read(iv);
        int encryptedBytesSize = inputStream.read();
        byte[] encryptedBytes = new byte[encryptedBytesSize];
        inputStream.read(encryptedBytes);
        inputStream.close();
        return internalGetDecryptionCipherForIv(iv).doFinal(encryptedBytes);
    }
}
