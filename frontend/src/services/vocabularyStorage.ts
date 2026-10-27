import type { VocabularyEntry } from '../types/story';

export interface SavedWord extends VocabularyEntry {
  learned: boolean;
  savedAt: string;
  reviewCount: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
}

const STORAGE_KEY = 'vocabular_saved_words';
export const VOCABULARY_UPDATED = 'vocabular:vocabulary-updated';

function normalizeWord(
    value: Partial<SavedWord> & VocabularyEntry
): SavedWord {
  return {
    word: value.word,
    definition: value.definition,
    example: value.example,
    learned: value.learned ?? false,
    savedAt: value.savedAt ?? new Date().toISOString(),
    reviewCount: value.reviewCount ?? 0,
    nextReviewAt: value.nextReviewAt ?? new Date().toISOString(),
    lastReviewedAt: value.lastReviewedAt ?? null,
  };
}

export function getSavedWords(): SavedWord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed
        .filter(
            (item): item is VocabularyEntry =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.word === 'string' &&
                typeof item.definition === 'string' &&
                typeof item.example === 'string'
        )
        .map((item) => normalizeWord(item as SavedWord));
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

  words.push(
      normalizeWord({
        ...entry,
        learned: false,
        savedAt: new Date().toISOString(),
      })
  );

  updateStorage(words);
}

export function removeWord(word: string): void {
  updateStorage(
      getSavedWords().filter(
          item => item.word.toLowerCase() !== word.toLowerCase()
      )
  );
}

export function setWordLearned(
    word: string,
    learned: boolean
): void {
  const words = getSavedWords().map(item =>
      item.word.toLowerCase() === word.toLowerCase()
          ? { ...item, learned }
          : item
  );

  updateStorage(words);
}

export function toggleLearned(word: string): void {
  const existing = getSavedWords().find(
      item => item.word.toLowerCase() === word.toLowerCase()
  );

  if (!existing) return;

  setWordLearned(word, !existing.learned);
}

export function isDue(word: SavedWord): boolean {
  return new Date(word.nextReviewAt).getTime() <= Date.now();
}

export function getDueWords(): SavedWord[] {
  return getSavedWords().filter(isDue);
}

export function reviewWord(
    word: string,
    remembered: boolean
): void {
  const intervals = [1, 3, 7, 14, 30];

  const now = new Date();

  const words = getSavedWords().map(item => {
    if (item.word.toLowerCase() !== word.toLowerCase()) {
      return item;
    }

    const reviewCount = remembered
        ? item.reviewCount + 1
        : 0;

    const intervalDays = remembered
        ? intervals[Math.min(reviewCount, intervals.length - 1)]
        : 1;

    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + intervalDays);

    return {
      ...item,
      learned: remembered,
      reviewCount,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextReview.toISOString(),
    };
  });

  updateStorage(words);
}