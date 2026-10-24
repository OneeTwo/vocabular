import type { Story } from '../types/story';

interface StoryCardProps {
    story: Story;
    onPlay: (storyId: string) => void;
}

export default function StoryCard({
                                      story,
                                      onPlay
                                  }: StoryCardProps) {

    return (
        <div className="story-card">
            <span className="level">{story.level}</span>

            <h2>{story.title}</h2>

            <p>{story.description}</p>

            <div className="story-footer">
                <span>⏱ {story.durationMinutes} min</span>

                <button onClick={() => onPlay(story.id)}>
                    Play →
                </button>
            </div>
        </div>
    );
}