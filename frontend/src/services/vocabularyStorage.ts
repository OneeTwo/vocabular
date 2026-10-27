import type { VocabularyEntry } from '../types/story';

export interface SavedWord extends VocabularyEntry {
  learned: boolean;
  savedAt: string;
}

const STORAGE_KEY = 'vocabular_saved_words';
export const VOCABULARY_UPDATED = 'vocabular:vocabulary-updated';

export function getSavedWords(): SavedWord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

  } catch {
    return [];
  }
}

function updateStorage(words: SavedWord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  window.dispatchEvent(new Event(VOCABULARY_UPDATED));
}

export function isWordSaved(word: string): boolean {
  return getSavedWords().some(
      item => item.word.toLowerCase() === word.toLowerCase()
  );
}

export function saveWord(entry: VocabularyEntry): void {
  if (isWordSaved(entry.word)) return;

  const words = getSavedWords();

        ...entry,
        learned: false,
        savedAt: new Date().toISOString(),

  updateStorage(words);
}

export function removeWord(word: string): void {
          item => item.word.toLowerCase() !== word.toLowerCase()
  );
}

  const words = getSavedWords().map(item =>
      item.word.toLowerCase() === word.toLowerCase()
          ? { ...item, learned }
          : item
  );

  );

}