import { useEffect, useState } from 'react';

import type { Story } from '../types/story';
import type { SavedWord } from '../services/vocabularyStorage';

import {
    getSavedWords,
    isDue,
    VOCABULARY_UPDATED,
} from '../services/vocabularyStorage';

import {
    getCompletedStories,
    PROGRESS_UPDATED,
} from '../services/progressStorage';

import type { CompletedStory } from '../services/progressStorage';

interface LearningDashboardProps {
    stories: Story[];
}

export default function LearningDashboard({
                                              stories,
                                          }: LearningDashboardProps) {
    const [words, setWords] = useState<SavedWord[]>(getSavedWords);
    const [completed, setCompleted] =
        useState<CompletedStory[]>(getCompletedStories);

    useEffect(() => {
        function refresh() {
            setWords(getSavedWords());
            setCompleted(getCompletedStories());
        }

        window.addEventListener(VOCABULARY_UPDATED, refresh);
        window.addEventListener(PROGRESS_UPDATED, refresh);
        window.addEventListener('storage', refresh);

        return () => {
            window.removeEventListener(VOCABULARY_UPDATED, refresh);
            window.removeEventListener(PROGRESS_UPDATED, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    const totalWords = words.length;
    const learnedWords = words.filter(word => word.learned).length;
    const dueWords = words.filter(isDue).length;

    const mastery = totalWords > 0
        ? Math.round((learnedWords / totalWords) * 100)
        : 0;

    return (
        <section className="learning-dashboard">
            <h2>My Learning Progress</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <span>📚 Saved Words</span>
                    <strong>{totalWords}</strong>
                </div>

                <div className="stat-card">
                    <span>✅ Learned Words</span>
                    <strong>{learnedWords}</strong>
                </div>

                <div className="stat-card">
                    <span>🔄 Due for Review</span>
                    <strong>{dueWords}</strong>
                </div>

                <div className="stat-card">
                    <span>🎮 Stories Completed</span>
                    <strong>{completed.length}</strong>
                </div>
            </div>

            <div className="mastery-section">
                <h3>Vocabulary Mastery</h3>

                <div
                    className="mastery-bar"
                    role="progressbar"
                    aria-label="Vocabulary mastery"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={mastery}
                >
                    <div
                        className="mastery-fill"
                        style={{ width: `${mastery}%` }}
                    />
                </div>

                <p>{mastery}% of saved words marked as learned</p>
            </div>

            <div className="completed-stories">
                <h3>Completed Stories</h3>

                {completed.length === 0 ? (
                    <p>
                        No completed stories yet. Play your first story!
                    </p>
                ) : (
                    <ul>
                        {completed.map(item => {
                            const story = stories.find(
                                story => story.id === item.storyId
                            );

                            return (
                                <li key={item.storyId}>
                                    ✓ {story?.title ?? item.storyId}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}