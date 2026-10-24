import { useEffect, useState } from 'react';

import type {
    Story,
    StoryProgress,
    StoryChoice,
    VocabularyEntry,
} from '../types/story';

import { getVocabulary } from '../api/storyApi';

import VocabularyText from './VocabularyText';
import TranslationPanel from './TranslationPanel';
import ChoiceFeedback from './ChoiceFeedback';

interface GameWindowProps {
    story: Story;
    progress: StoryProgress;
    loading: boolean;
    onChoice: (choiceId: string) => void;
    onExit: () => void;
}

export default function GameWindow({
                                       story,
                                       progress,
                                       loading,
                                       onChoice,
                                       onExit,
                                   }: GameWindowProps) {
    // Vocabulary
    const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>([]);
    const [vocabularyError, setVocabularyError] = useState(false);

    // Translation
    const [showTranslation, setShowTranslation] = useState(false);

    // Learning feedback
    const [selectedChoice, setSelectedChoice] =
        useState<StoryChoice | null>(null);

    // Load vocabulary when the story changes
    useEffect(() => {
        let active = true;

        setVocabulary([]);
        setVocabularyError(false);

        getVocabulary(story.id)
            .then((words) => {
                if (active) {
                    setVocabulary(words);
                }
            })
            .catch((error) => {
                console.error('Failed to load vocabulary:', error);

                if (active) {
                    setVocabularyError(true);
                }
            });

        return () => {
            active = false;
        };
    }, [story.id]);

    // Reset translation and feedback when the step changes
    useEffect(() => {
        setShowTranslation(false);
        setSelectedChoice(null);
    }, [progress.stepNumber, progress.step?.id, story.id]);

    // Handle choice selection
    function handleChoiceClick(choice: StoryChoice) {
        if (loading || selectedChoice) return;

        if (choice.feedback) {
            setSelectedChoice(choice);
        } else {
            onChoice(choice.id);
        }
    }

    // Continue after viewing feedback
    function handleContinue() {
        if (!selectedChoice || loading) return;

        onChoice(selectedChoice.id);
    }

    // Story completion
    if (progress.finished) {
        return (
            <div className="game-window completion">
                <h2>🎉 Story Completed!</h2>

                <p>
                    Great job! You've successfully completed{' '}
                    <strong>{story.title}</strong>.
                </p>

                <p>
                    Keep practicing to improve your English!
                </p>

                <button type="button" onClick={onExit}>
                    Back to Stories
                </button>
            </div>
        );
    }

    const step = progress.step;

    if (!step) {
        return (
            <div className="game-window">
                <p>Unable to load the current story step.</p>

                <button type="button" onClick={onExit}>
                    Back to Stories
                </button>
            </div>
        );
    }

    return (
        <div className="game-window">

            {/* Header */}
            <div className="game-header">
                <button
                    type="button"
                    className="back-button"
                    onClick={onExit}
                    disabled={loading}
                >
                    ← Back
                </button>

                <span className="level">{story.level}</span>
            </div>

            {/* Story title */}
            <div className="game-title">
                <h2>{story.title}</h2>

                <p>Step {progress.stepNumber}</p>
            </div>

            {/* Dialogue */}
            <div className="dialogue">
                <strong>{step.speaker}</strong>

                <p>
                    <VocabularyText
                        key={step.id}
                        text={step.message}
                        vocabulary={vocabulary}
                    />
                </p>
            </div>

            {/* Learning feedback or answer choices */}
            {selectedChoice?.feedback ? (
                <ChoiceFeedback
                    feedback={selectedChoice.feedback}
                    selectedAnswer={selectedChoice.text}
                    onContinue={handleContinue}
                    loading={loading}
                />
            ) : (
                <div className="choices">
                    {step.choices.map((choice) => (
                        <button
                            key={choice.id}
                            type="button"
                            className="choice-button"
                            disabled={loading}
                            onClick={() => handleChoiceClick(choice)}
                        >
                            <span>{choice.id}.</span>
                            {choice.text}
                        </button>
                    ))}
                </div>
            )}

            {/* Vocabulary warning */}
            {vocabularyError && (
                <p className="error" role="status">
                    Vocabulary hints are temporarily unavailable.
                </p>
            )}

            {/* Translation */}
            <button
                type="button"
                className="translate-button"
                onClick={() => setShowTranslation((previous) => !previous)}
                aria-expanded={showTranslation}
            >
                🌐 Need translation?
            </button>

            {showTranslation && (
                <TranslationPanel
                    key={`${story.id}-${step.id}`}
                    text={step.message}
                    onClose={() => setShowTranslation(false)}
                />
            )}

        </div>
    );
}