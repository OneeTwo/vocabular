import { useEffect, useState } from 'react';

import type { Story, StoryProgress } from './types/story';

import {
  getStories,
  startStory,
  getProgress,
  submitChoice,
} from './api/storyApi';

import StoryCard from './components/StoryCard';
import GameWindow from './components/GameWindow';
import MyVocabulary from './components/MyVocabulary';
import { completeStory } from './services/progressStorage';
import LearningDashboard from './components/LearningDashboard';

import './App.css';

export default function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [progress, setProgress] = useState<StoryProgress | null>(null);

  const [loading, setLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available stories
  useEffect(() => {
    let active = true;

    async function loadStories() {
      try {
        const data = await getStories();

        if (active) {
          setStories(data);
        }
      } catch (err) {
        console.error('Failed to load stories:', err);

        if (active) {
          setError('Unable to load stories. Please try again.');
        }
      } finally {
        if (active) {
          setStoriesLoading(false);
        }
      }
    }

    loadStories();

    return () => {
      active = false;
    };
  }, []);

  // Start a new story
  async function handlePlay(story: Story) {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const session = await startStory(story.id);
      const initialProgress = await getProgress(session.sessionId);

      setSelectedStory(story);
      setProgress(initialProgress);
    } catch (err) {
      console.error('Failed to start story:', err);
      setError('Unable to start this story. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Submit an answer and advance the story
  async function handleChoice(choiceId: string) {
    if (!progress || loading) return;

    setLoading(true);
    setError(null);

    try {
      const nextProgress = await submitChoice(
          progress.sessionId,
          choiceId
      );

      setProgress(nextProgress);
      if (nextProgress.finished && selectedStory) {
        completeStory(selectedStory.id);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Unable to submit your answer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Return to the story catalogue
  function handleExit() {
    if (loading) return;

    setSelectedStory(null);
    setProgress(null);
    setError(null);
  }

  return (
      <div className="app">
        {/* Header */}
        <header className="header">
          <h1>Vocabular</h1>
          <p>Learn real English through interactive stories.</p>
        </header>

        <main className="container">
          {/* Error messages */}
          {error && (
              <div className="error" role="alert">
                <p>{error}</p>
              </div>
          )}

          {/* Loading stories */}
          {storiesLoading && !selectedStory && (
              <p>Loading stories...</p>
          )}

          {/* Story gameplay */}
          {selectedStory && progress ? (
              <GameWindow
                  story={selectedStory}
                  progress={progress}
                  loading={loading}
                  onChoice={handleChoice}
                  onExit={handleExit}
              />
          ) : (
              <>
                {/* Personal vocabulary collection */}
                <LearningDashboard stories={stories} />
                <MyVocabulary />

                {/* Story catalogue */}
                <section className="stories-section">
                  <h2>Choose Your Story</h2>

                  {!storiesLoading && stories.length === 0 ? (
                      <p>No stories available.</p>
                  ) : (
                      <div className="story-grid">
                        {stories.map((story) => (
                            <StoryCard
                                key={story.id}
                                story={story}
                                onPlay={() => handlePlay(story)}
                            />
                        ))}
                      </div>
                  )}
                </section>
              </>
          )}
        </main>

        <footer className="footer">
          <p>Vocabular — Practice English. Make better choices.</p>
        </footer>
      </div>
  );
}