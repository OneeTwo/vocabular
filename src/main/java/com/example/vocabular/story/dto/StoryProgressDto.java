package com.example.vocabular.story.dto;

import java.util.UUID;

public record StoryProgressDto(
        UUID sessionId,
        String storyId,
        int stepNumber,
        boolean finished,
        StoryStepDto step
) {
}