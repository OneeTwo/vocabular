import { useEffect, useState } from 'react';
import type { SavedWord } from '../services/vocabularyStorage';

interface FlashcardsProps {
    words: SavedWord[];
    onClose: () => void;
    onReview: (word: string, learned: boolean) => void;
}

export default function Flashcards({
                                       words,
                                       onClose,
                                       onReview,
                                   }: FlashcardsProps) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [reviewed, setReviewed] = useState(0);

    const currentWord = words[index];

    useEffect(() => {
        setFlipped(false);
    }, [index]);

    function handleReview(learned: boolean) {
        if (!currentWord) return;

        onReview(currentWord.word, learned);
        setReviewed(previous => previous + 1);
        setFlipped(false);
        setIndex(previous => previous + 1);
    }

    if (index >= words.length) {
        return (
            <div className="flashcard-session">
                <h2>🎉 Practice Complete!</h2>
                <p>You reviewed {reviewed} words.</p>
                <button type="button" onClick={onClose}>
                    Back to Vocabulary
                </button>
            </div>
        );
    }

    return (
        <div className="flashcard-session">
            <div className="flashcard-header">
                <h2>Vocabulary Practice</h2>
                <button type="button" onClick={onClose}>✕</button>
            </div>

            <p>Card {index + 1} / {words.length}</p>

            <div className="flashcard">
                <h2>{currentWord.word}</h2>

                {!flipped ? (
                    <button
                        type="button"
                        onClick={() => setFlipped(true)}
                    >
                        Show Meaning
                    </button>
                ) : (
                    <>
                        <p>{currentWord.definition}</p>
                        <p className="flashcard-example">
                            Example: {currentWord.example}
                        </p>
                        <div className="flashcard-actions">
                            <button
                                type="button"
                                onClick={() => handleReview(false)}
                            >
                                Still Learning
                            </button>
                            <button
                                type="button"
                                onClick={() => handleReview(true)}
                            >
                                I Know This
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}