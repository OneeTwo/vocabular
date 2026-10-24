package com.example.vocabular.translation.dto;

public record LibreTranslateRequest(
        String q,
        String source,
        String target,
        String format
) {
}