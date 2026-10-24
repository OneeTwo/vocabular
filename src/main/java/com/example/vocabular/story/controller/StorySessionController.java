package com.example.vocabular.story.controller;

import com.example.vocabular.story.dto.*;
import com.example.vocabular.story.model.StorySession;
import com.example.vocabular.story.service.StorySessionService;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
public class StorySessionController {

    private final StorySessionService storySessionService;

    public StorySessionController(
            StorySessionService storySessionService
    ) {
        this.storySessionService = storySessionService;
    }

    @PostMapping("/{storyId}/start")
    public StorySession startStory(
            @PathVariable String storyId
    ) {
        return storySessionService.startStory(storyId);
    }

    @GetMapping("/sessions/{sessionId}")
    public StorySession getSession(
            @PathVariable UUID sessionId
    ) {
        return storySessionService.getSession(sessionId);
    }

    @GetMapping("/sessions/{sessionId}/progress")
    public StoryProgressDto getProgress(
            @PathVariable UUID sessionId
    ) {
        return storySessionService.getProgress(sessionId);
    }

    @PostMapping("/sessions/{sessionId}/answer")
    public StoryProgressDto submitChoice(
            @PathVariable UUID sessionId,
            @RequestBody SubmitChoiceRequest request
    ) {
        return storySessionService.submitChoice(
                sessionId,
                request.choiceId()
        );
    }
}