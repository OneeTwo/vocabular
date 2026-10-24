package com.example.vocabular.story.dto;

import java.util.List;

public record StoryTemplateDto(
        String id,
        String title,
        String level,
        int durationMinutes,
        String description,
        String setting,
        String goal,
        List<String> vocabulary,
        List<String> grammar
) {
}