package com.example.vocabular.translation.dto;

public record TranslationResponse(
        String originalText,
        String translatedText,
        String targetLanguage
) {
}