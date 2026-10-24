package com.example.vocabular.story.dto;

import java.util.List;

public record StoryStepDto(
        String id,
        String speaker,
        String message,
        List<StoryChoiceDto> choices
) {
}