package com.example.vocabular.story.controller;

import com.example.vocabular.story.dto.StoryTemplateDto;
import com.example.vocabular.story.service.StoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    public List<StoryTemplateDto> getAllStories(
            @RequestParam(required = false) String level
    ) {

        if (level != null) {
            return storyService.getStoriesByLevel(level);
        }

        return storyService.getAllStories();
    }

    @GetMapping("/{id}")
    public StoryTemplateDto getStoryById(
            @PathVariable String id
    ) {
        return storyService.getStoryById(id);
    }
}