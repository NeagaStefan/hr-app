package org.example.hrappbackend.dto;

public record AuthResponse(
        String token,
        String type,
        String username,
        String role
) {
    public AuthResponse(String token, String username, String role) {
        this(token, "Bearer", username, role);
    }
}