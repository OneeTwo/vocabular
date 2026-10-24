package com.example.vocabular.story.dto;

public record StoryChoiceDto(
        String id,
        String text,
        String nextStepId,
        ChoiceFeedbackDto feedback
) {
}