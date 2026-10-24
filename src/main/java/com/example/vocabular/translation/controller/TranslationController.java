package com.example.vocabular.translation.controller;

import com.example.vocabular.translation.dto.TranslationRequest;
import com.example.vocabular.translation.dto.TranslationResponse;
import com.example.vocabular.translation.service.TranslationService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/translation")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping
    public TranslationResponse translate(
            @Valid @RequestBody TranslationRequest request
    ) {
        return translationService.translate(request);
    }
}