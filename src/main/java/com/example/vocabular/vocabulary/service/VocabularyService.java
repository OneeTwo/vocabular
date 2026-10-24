package com.example.vocabular.vocabulary.service;

import com.example.vocabular.vocabulary.dto.VocabularyDto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.List;

@Service
public class VocabularyService {

    private final ObjectMapper objectMapper;

    public VocabularyService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<VocabularyDto> getVocabulary(String storyId) {

        var resource = new ClassPathResource(
                "vocabulary/" + storyId + ".json"
        );

        if (!resource.exists()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Vocabulary not found: " + storyId
            );
        }

        try (var inputStream = resource.getInputStream()) {

            VocabularyDto[] words = objectMapper.readValue(
                    inputStream.readAllBytes(),
                    VocabularyDto[].class
            );

            return Arrays.asList(words);

        } catch (IOException e) {
            throw new UncheckedIOException(
                    "Failed to load vocabulary: " + storyId,
                    e
            );
        }
    }
}