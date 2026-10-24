import { useState } from 'react';

interface TranslationPanelProps {
    text: string;
    onClose: () => void;
}

interface TranslationResponse {
    originalText: string;
    translatedText: string;
    targetLanguage: string;
}

export default function TranslationPanel({
                                             text,
                                             onClose,
                                         }: TranslationPanelProps) {
    const [language, setLanguage] = useState('uk');
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleTranslate() {
        setLoading(true);
        setTranslation('');

        try {
            const response = await fetch('/api/translation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    targetLanguage: language,
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data: TranslationResponse = await response.json();

            setTranslation(data.translatedText);
        } catch {
            setTranslation('Unable to translate this text.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="translation-panel">
            <div className="translation-header">
                <h3>Translation</h3>
                <button type="button" onClick={onClose}>
                    ✕
                </button>
            </div>

            <label htmlFor="translation-language">Translate to:</label>

            <select
                id="translation-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
            >
                <option value="uk">Ukrainian</option>
            </select>

            <button
                type="button"
                onClick={handleTranslate}
                disabled={loading}
                className="translate-action"
            >
                {loading ? 'Translating...' : 'Translate'}
            </button>

            {translation && (
                <p className="translation-result">{translation}</p>
            )}
        </div>
    );
}