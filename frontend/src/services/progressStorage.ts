export interface CompletedStory {
    storyId: string;
    completedAt: string;
}

const STORAGE_KEY = 'vocabular_completed_stories';

export const PROGRESS_UPDATED = 'vocabular:progress-updated';

export function getCompletedStories(): CompletedStory[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed.filter(
                (item): item is CompletedStory =>
                    item !== null &&
                    typeof item === 'object' &&
                    typeof item.storyId === 'string' &&
                    typeof item.completedAt === 'string'
            )
            : [];
    } catch {
        return [];
    }
}

export function completeStory(storyId: string): void {
    const stories = getCompletedStories();

    if (stories.some(item => item.storyId === storyId)) {
        return;
    }

    stories.push({
        storyId,
        completedAt: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));

    window.dispatchEvent(new Event(PROGRESS_UPDATED));
}