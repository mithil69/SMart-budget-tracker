package com.budget.tracker.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, Long userId) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) getKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public Long extractUserId(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) getKey()).build()
                .parseSignedClaims(token).getPayload().get("userId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
