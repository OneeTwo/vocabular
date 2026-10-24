package com.example.vocabular.story.model;

import java.util.UUID;

public class StorySession {

    private final UUID sessionId;
    private final String storyId;

    private int currentStep;
    private String currentStepId;
    private boolean finished;

    public StorySession(String storyId, String startStepId) {
        this.sessionId = UUID.randomUUID();
        this.storyId = storyId;
        this.currentStep = 1;
        this.currentStepId = startStepId;
        this.finished = false;
    }

    public UUID getSessionId() {
        return sessionId;
    }

    public String getStoryId() {
        return storyId;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public String getCurrentStepId() {
        return currentStepId;
    }

    public boolean isFinished() {
        return finished;
    }

    public void advance(String nextStepId) {
        currentStep++;

        if (nextStepId == null) {
            finished = true;
            currentStepId = null;
        } else {
            currentStepId = nextStepId;
        }
    }
}