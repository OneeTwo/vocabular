import { useState } from 'react';
import type { VocabularyEntry } from '../types/story';

import {
    saveWord,
    isWordSaved,
} from '../services/vocabularyStorage';

interface VocabularyTextProps {
    text: string;
    vocabulary: VocabularyEntry[];
}

export default function VocabularyText({
                                           text,
                                           vocabulary,
                                       }: VocabularyTextProps) {
    const [selectedWord, setSelectedWord] =
        useState<VocabularyEntry | null>(null);

    const [saved, setSaved] = useState(false);

    function handleWordClick(entry: VocabularyEntry) {
        setSelectedWord(entry);
        setSaved(isWordSaved(entry.word));
    }

    function handleSaveWord() {
        if (!selectedWord) return;

        saveWord(selectedWord);
        setSaved(true);
    }

    if (vocabulary.length === 0) {
        return <>{text}</>;
    }

    const escapeRegex = (value: string) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const words = [...vocabulary]
        .filter(item => item.word.trim().length > 0)
        .sort((a, b) => b.word.length - a.word.length);

    if (words.length === 0) {
        return <>{text}</>;
    }

    const pattern = new RegExp(
        `\\b(${words.map(item => escapeRegex(item.word)).join('|')})\\b`,
        'gi'
    );

    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, index) => {
                const entry = words.find(
                    item => item.word.toLowerCase() === part.toLowerCase()
                );

                if (!entry) {
                    return <span key={index}>{part}</span>;
                }

                return (
                    <button
                        key={index}
                        type="button"
                        className="vocabulary-word"
                        onClick={() => handleWordClick(entry)}
                    >
                        {part}
                    </button>
                );
            })}

            {selectedWord && (
                <div className="vocabulary-hint">

                    <h3>📖 {selectedWord.word}</h3>

                    <strong>Meaning</strong>
                    <p>{selectedWord.definition}</p>

                    <strong>Example</strong>
                    <p>{selectedWord.example}</p>

                    <div className="vocabulary-actions">
                        <button
                            type="button"
                            onClick={handleSaveWord}
                            disabled={saved}
                        >
                            {saved ? '✓ Saved' : '+ Save Word'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedWord(null)}
                        >
                            Got it!
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}