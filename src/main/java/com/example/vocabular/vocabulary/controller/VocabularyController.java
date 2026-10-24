package com.example.vocabular.vocabulary.controller;

import com.example.vocabular.vocabulary.dto.VocabularyDto;
import com.example.vocabular.vocabulary.service.VocabularyService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories/{storyId}/vocabulary")
public class VocabularyController {

    private final VocabularyService vocabularyService;

    public VocabularyController(VocabularyService vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    @GetMapping
    public List<VocabularyDto> getVocabulary(
            @PathVariable String storyId
    ) {
        return vocabularyService.getVocabulary(storyId);
    }
}