package com.example.vocabular.story.dto;

import java.util.List;

public record StoryGameplayDto(
        String storyId,
        String startStepId,
        List<StoryStepDto> steps
) {
}