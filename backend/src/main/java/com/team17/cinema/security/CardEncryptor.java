package com.team17.cinema.security;

import org.springframework.stereotype.Component;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * Simple AES encryption utility for payment cards.
 * In production, use a proper secrets management system like AWS KMS or HashiCorp Vault.
 */
@Component
public class CardEncryptor {
    
    // IMPORTANT: In production, load this from secure secrets manager
    private static final String ENCRYPTION_KEY = "0123456789ABCDEF0123456789ABCDEF"; // 32 chars = 256-bit key
    private static final String ALGORITHM = "AES";
    
    public String encrypt(String plaintext) {
        try {
            SecretKeySpec key = new SecretKeySpec(
                ENCRYPTION_KEY.getBytes("UTF-8"),
                0,
                ENCRYPTION_KEY.getBytes().length,
                ALGORITHM
            );
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            
            byte[] encrypted = cipher.doFinal(plaintext.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    public String decrypt(String encryptedText) {
        try {
            SecretKeySpec key = new SecretKeySpec(
                ENCRYPTION_KEY.getBytes("UTF-8"),
                0,
                ENCRYPTION_KEY.getBytes().length,
                ALGORITHM
            );
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);
            
            byte[] decodedValue = Base64.getDecoder().decode(encryptedText);
            byte[] decrypted = cipher.doFinal(decodedValue);
            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
