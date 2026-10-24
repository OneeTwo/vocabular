package com.example.vocabular.translation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TranslationRequest(

        @NotBlank
        @Size(max = 1000)
        String text,

        @NotBlank
        String targetLanguage

) {
}