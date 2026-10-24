import type { ChoiceFeedback as Feedback } from '../types/story';

interface ChoiceFeedbackProps {
    feedback: Feedback;
    selectedAnswer: string;
    onContinue: () => void;
    loading: boolean;
}

export default function ChoiceFeedback({
                                           feedback,
                                           selectedAnswer,
                                           onContinue,
                                           loading,
                                       }: ChoiceFeedbackProps) {
    return (
        <div className="feedback-panel">

            <div className="feedback-heading">
                <span>💡</span>
                <h3>Learning Feedback</h3>
            </div>

            <div className="feedback-selected">
                <span>Your answer:</span>
                <p>{selectedAnswer}</p>
            </div>

            <div className="feedback-tone">
                {feedback.tone}
            </div>

            <p className="feedback-explanation">
                {feedback.explanation}
            </p>

            {feedback.alternative && (
                <div className="feedback-alternative">
                    <strong>Another natural expression:</strong>
                    <p>{feedback.alternative}</p>
                </div>
            )}

            <button
                type="button"
                className="feedback-continue"
                onClick={onContinue}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Continue →'}
            </button>

        </div>
    );
}