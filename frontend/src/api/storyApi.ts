import type {
    Story,
    StorySession,
    StoryProgress,
} from '../types/story';
import type { VocabularyEntry } from '../types/story';

const API_URL = '/api/stories';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export async function getStories(): Promise<Story[]> {
    const response = await fetch(API_URL);
    return handleResponse<Story[]>(response);
}

export async function startStory(
    storyId: string
): Promise<StorySession> {
    const response = await fetch(
        `${API_URL}/${encodeURIComponent(storyId)}/start`,
        { method: 'POST' }
    );

    return handleResponse<StorySession>(response);
}

export async function getProgress(
    sessionId: string
): Promise<StoryProgress> {
    const response = await fetch(
        `${API_URL}/sessions/${sessionId}/progress`
    );

    return handleResponse<StoryProgress>(response);
}

export async function submitChoice(
    sessionId: string,
    choiceId: string
): Promise<StoryProgress> {
    const response = await fetch(
        `${API_URL}/sessions/${sessionId}/answer`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ choiceId }),
        }
    );

    return handleResponse<StoryProgress>(response);
}

export async function getVocabulary(
    storyId: string
): Promise<VocabularyEntry[]> {
    const response = await fetch(
        `/api/stories/${encodeURIComponent(storyId)}/vocabulary`
    );

    if (!response.ok) {
        throw new Error('Failed to load vocabulary');
    }

    return response.json();
}