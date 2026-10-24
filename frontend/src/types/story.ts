export interface Story {
    id: string;
    title: string;
    level: string;
    durationMinutes: number;
    description: string;
}

export interface StoryChoice {
    id: string;
    text: string;
    feedback?: ChoiceFeedback | null;
}

export interface StoryStep {
    id: string;
    speaker: string;
    message: string;
    choices: StoryChoice[];
}

export interface StorySession {
    sessionId: string;
    storyId: string;
    currentStep: number;
}

export interface StoryProgress {
    sessionId: string;
    storyId: string;
    stepNumber: number;
    finished: boolean;
    step: StoryStep | null;
}

export interface VocabularyEntry {
    word: string;
    definition: string;
    example: string;
}

export interface ChoiceFeedback {
    tone: string;
    explanation: string;
    alternative: string;
}