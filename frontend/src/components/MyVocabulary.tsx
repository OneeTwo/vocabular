import { useEffect, useState } from 'react';

import Flashcards from './Flashcards';

import {
    getSavedWords,
    getDueWords,
    removeWord,
    toggleLearned,
    reviewWord,
    VOCABULARY_UPDATED,
} from '../services/vocabularyStorage';

import type { SavedWord } from '../services/vocabularyStorage';

export default function MyVocabulary() {
    const [words, setWords] = useState<SavedWord[]>(getSavedWords);
    const [showVocabulary, setShowVocabulary] = useState(false);
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [practiceWords, setPracticeWords] = useState<SavedWord[]>([]);

    useEffect(() => {
        function refreshWords() {
            setWords(getSavedWords());
        }

        window.addEventListener(VOCABULARY_UPDATED, refreshWords);
        window.addEventListener('storage', refreshWords);

        return () => {
            window.removeEventListener(VOCABULARY_UPDATED, refreshWords);
            window.removeEventListener('storage', refreshWords);
        };
    }, []);

    const learnedCount = words.filter(word => word.learned).length;
    const dueCount = words.filter(
        word => new Date(word.nextReviewAt).getTime() <= Date.now()
    ).length;

    function handleStartPractice(dueOnly: boolean) {
        const selectedWords = dueOnly ? getDueWords() : getSavedWords();

        if (selectedWords.length === 0) return;

        setPracticeWords(selectedWords);
        setShowFlashcards(true);
    }

    function handleReview(word: string, remembered: boolean) {
        reviewWord(word, remembered);
    }

    function handleClosePractice() {
        setShowFlashcards(false);
        setPracticeWords([]);
    }

    function handleToggleVocabulary() {
        if (showFlashcards) {
            handleClosePractice();
        }

        setShowVocabulary(previous => !previous);
    }

    function formatReviewDate(date: string): string {
        const reviewDate = new Date(date);

        if (Number.isNaN(reviewDate.getTime())) {
            return 'Review now';
        }

        if (reviewDate.getTime() <= Date.now()) {
            return 'Due now';
        }

        return reviewDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    return (
        <section className="my-vocabulary">
            <button
                type="button"
                className="vocabulary-toggle"
                onClick={handleToggleVocabulary}
                aria-expanded={showVocabulary}
            >
                📚 My Vocabulary ({words.length})
            </button>

            {showVocabulary && (
                <div className="vocabulary-collection">
                    <h2>My Vocabulary</h2>

                    <p>
                        Saved: {words.length} | Learned: {learnedCount} |
                        Due now: {dueCount}
                    </p>

                    {showFlashcards ? (
                        <Flashcards
                            words={practiceWords}
                            onClose={handleClosePractice}
                            onReview={handleReview}
                        />
                    ) : (
                        <>
                            {words.length > 0 && (
                                <div className="practice-actions">
                                    <button
                                        type="button"
                                        className="practice-button"
                                        onClick={() => handleStartPractice(true)}
                                        disabled={dueCount === 0}
                                    >
                                        Practice Due Words ({dueCount})
                                    </button>

                                    <button
                                        type="button"
                                        className="practice-button secondary"
                                        onClick={() => handleStartPractice(false)}
                                    >
                                        Practice All
                                    </button>
                                </div>
                            )}

                            {words.length === 0 ? (
                                <p className="vocabulary-empty">
                                    No saved words yet. Play a story and save
                                    words you want to practice!
                                </p>
                            ) : (
                                <div className="saved-words">
                                    {words.map(word => (
                                        <div
                                            key={word.word.toLowerCase()}
                                            className={`saved-word-card ${
                                                word.learned ? 'learned' : ''
                                            }`}
                                        >
                                            <div className="saved-word-header">
                                                <h3>{word.word}</h3>

                                                <span>
                          {word.learned ? '✓ Learned' : 'Learning'}
                        </span>
                                            </div>

                                            <p>{word.definition}</p>

                                            <p className="saved-word-example">
                                                Example: {word.example}
                                            </p>

                                            <p className="review-info">
                                                Next review: {formatReviewDate(word.nextReviewAt)}
                                            </p>

                                            <p className="review-info">
                                                Successful reviews: {word.reviewCount}
                                            </p>

                                            <div className="saved-word-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleLearned(word.word)}
                                                >
                                                    {word.learned
                                                        ? 'Mark as Learning'
                                                        : 'Mark as Learned'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="remove-word"
                                                    onClick={() => removeWord(word.word)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </section>
    );
}