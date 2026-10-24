package com.example.vocabular.story.service;

import com.example.vocabular.story.dto.StoryGameplayDto;
import com.example.vocabular.story.dto.StoryStepDto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;

@Service
public class StoryGameplayService {

    private final ObjectMapper objectMapper;

    public StoryGameplayService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public StoryGameplayDto getGameplay(String storyId) {

        var resource = new ClassPathResource(
                "gameplay/" + storyId + ".json"
        );

        if (!resource.exists()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Gameplay not found: " + storyId
            );
        }

        try (var inputStream = resource.getInputStream()) {
            StoryGameplayDto gameplay = objectMapper.readValue(
                    inputStream.readAllBytes(),
                    StoryGameplayDto.class
            );

            if (!storyId.equals(gameplay.storyId())) {
                throw new IllegalStateException(
                        "Story ID does not match gameplay file"
                );
            }

            return gameplay;

        } catch (IOException e) {
            throw new UncheckedIOException(
                    "Failed to load gameplay: " + storyId, e
            );
        }
    }

    public StoryStepDto getStep(String storyId, String stepId) {

        return getGameplay(storyId).steps().stream()
                .filter(step -> step.id().equals(stepId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Missing gameplay step: " + stepId
                ));
    }
}