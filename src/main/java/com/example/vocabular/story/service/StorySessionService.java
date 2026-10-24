package com.example.vocabular.story.service;

import com.example.vocabular.story.dto.*;
import com.example.vocabular.story.model.StorySession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StorySessionService {

    private final StoryService storyService;
    private final StoryGameplayService gameplayService;

    private final Map<UUID, StorySession> sessions =
            new ConcurrentHashMap<>();

    public StorySessionService(
            StoryService storyService,
            StoryGameplayService gameplayService
    ) {
        this.storyService = storyService;
        this.gameplayService = gameplayService;
    }

    public StorySession startStory(String storyId) {

        storyService.getStoryById(storyId);

        StoryGameplayDto gameplay =
                gameplayService.getGameplay(storyId);

        // Verify that the first step exists
        gameplayService.getStep(
                storyId,
                gameplay.startStepId()
        );

        StorySession session = new StorySession(
                storyId,
                gameplay.startStepId()
        );

        sessions.put(session.getSessionId(), session);

        return session;
    }

    public StorySession getSession(UUID sessionId) {

        StorySession session = sessions.get(sessionId);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Story session not found"
            );
        }

        return session;
    }

    public StoryProgressDto getProgress(UUID sessionId) {
        StorySession session = getSession(sessionId);

        synchronized (session) {
            return buildProgress(session);
        }
    }

    public StoryProgressDto submitChoice(
            UUID sessionId,
            String choiceId
    ) {

        StorySession session = getSession(sessionId);

        synchronized (session) {

            if (session.isFinished()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This story is already finished"
                );
            }

            StoryStepDto currentStep = gameplayService.getStep(
                    session.getStoryId(),
                    session.getCurrentStepId()
            );

            StoryChoiceDto selectedChoice =
                    currentStep.choices().stream()
                            .filter(choice ->
                                    choice.id().equals(choiceId))
                            .findFirst()
                            .orElseThrow(() ->
                                    new ResponseStatusException(
                                            HttpStatus.BAD_REQUEST,
                                            "Invalid choice: " + choiceId
                                    )
                            );

            String nextStepId = selectedChoice.nextStepId();

            // Verify the destination before changing the session
            if (nextStepId != null) {
                gameplayService.getStep(
                        session.getStoryId(),
                        nextStepId
                );
            }

            session.advance(nextStepId);

            return buildProgress(session);
        }
    }

    private StoryProgressDto buildProgress(StorySession session) {

        StoryStepDto step = null;

        if (!session.isFinished()) {
            step = gameplayService.getStep(
                    session.getStoryId(),
                    session.getCurrentStepId()
            );
        }

        return new StoryProgressDto(
                session.getSessionId(),
                session.getStoryId(),
                session.getCurrentStep(),
                session.isFinished(),
                step
        );
    }
}