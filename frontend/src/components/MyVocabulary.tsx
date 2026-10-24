import { useEffect, useState } from 'react';

import Flashcards from './Flashcards';

import {
    getSavedWords,
    removeWord,
    toggleLearned,
    setWordLearned,
    VOCABULARY_UPDATED,
} from '../services/vocabularyStorage';

import type { SavedWord } from '../services/vocabularyStorage';

export default function MyVocabulary() {
    const [words, setWords] = useState<SavedWord[]>(getSavedWords);

    const [showVocabulary, setShowVocabulary] = useState(false);
    const [showFlashcards, setShowFlashcards] = useState(false);

    const [practiceWords, setPracticeWords] = useState<SavedWord[]>([]);

    // Keep vocabulary synchronized with localStorage
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

    const learnedCount = words.filter((word) => word.learned).length;
    const learningCount = words.length - learnedCount;

    // Start a flashcard practice session
    function handleStartPractice() {
        const savedWords = getSavedWords();

        if (savedWords.length === 0) return;

        setPracticeWords([...savedWords]);
        setShowFlashcards(true);
    }

    // Update a word's learned status after reviewing a flashcard
    function handleReview(word: string, learned: boolean) {
        setWordLearned(word, learned);
    }

    // Remove a saved word
    function handleRemove(word: string) {
        removeWord(word);
    }

    // Toggle between learned and learning
    function handleToggleLearned(word: string) {
        toggleLearned(word);
    }

    // Close flashcard practice
    function handleCloseFlashcards() {
        setShowFlashcards(false);
        setPracticeWords([]);
    }

    // Open or close vocabulary collection
    function handleToggleVocabulary() {
        if (showFlashcards) {
            handleCloseFlashcards();
        }

        setShowVocabulary((previous) => !previous);
    }

    return (
        <section className="my-vocabulary">

            {/* Vocabulary button */}
            <button
                type="button"
                className="vocabulary-toggle"
                onClick={handleToggleVocabulary}
                aria-expanded={showVocabulary}
            >
                📚 My Vocabulary ({words.length})
            </button>

            {/* Vocabulary collection */}
            {showVocabulary && (
                <div className="vocabulary-collection">

                    {/* Heading */}
                    <h2>My Vocabulary</h2>

                    {/* Statistics */}
                    <p>
                        Saved: {words.length} | Learning: {learningCount} |
                        Learned: {learnedCount}
                    </p>

                    {/* Flashcard practice */}
                    {showFlashcards ? (
                        <Flashcards
                            words={practiceWords}
                            onClose={handleCloseFlashcards}
                            onReview={handleReview}
                        />
                    ) : (
                        <>
                            {/* Practice button */}
                            {words.length > 0 && (
                                <button
                                    type="button"
                                    className="practice-button"
                                    onClick={handleStartPractice}
                                >
                                    🃏 Practice Flashcards
                                </button>
                            )}

                            {/* Empty vocabulary */}
                            {words.length === 0 ? (
                                <p className="vocabulary-empty">
                                    No saved words yet. Play a story and save
                                    words you want to practice!
                                </p>
                            ) : (
                                /* Saved words */
                                <div className="saved-words">
                                    {words.map((word) => (
                                        <div
                                            key={word.word.toLowerCase()}
                                            className={`saved-word-card ${
                                                word.learned ? 'learned' : ''
                                            }`}
                                        >

                                            {/* Word header */}
                                            <div className="saved-word-header">
                                                <h3>{word.word}</h3>

                                                <span>
                          {word.learned ? '✓ Learned' : 'Learning'}
                        </span>
                                            </div>

                                            {/* Definition */}
                                            <p>{word.definition}</p>

                                            {/* Example */}
                                            <p className="saved-word-example">
                                                Example: {word.example}
                                            </p>

                                            {/* Actions */}
                                            <div className="saved-word-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleLearned(word.word)
                                                    }
                                                >
                                                    {word.learned
                                                        ? 'Mark as Learning'
                                                        : 'Mark as Learned'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="remove-word"
                                                    onClick={() => handleRemove(word.word)}
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