'use client';

import React from 'react';

import CompletedWordsList from '@components/completedWordsList';
import ProgressBar from '@components/progressBar';
import useVocabQuiz from '@hooks/useVocabQuiz';

interface VocabQuizProps {
  language: string;
  topic: string;
  onBack: () => void;
}

const VocabQuiz: React.FC<VocabQuizProps> = ({ language, topic, onBack }) => {
  const {
    wordQueue,
    currentWord,
    userInput,
    feedback,
    isInCorrectionMode,
    completedWords,
    wordsCompleted,
    totalWords,
    handleSubmit,
    setUserInput,
  } = useVocabQuiz({ language, topic, onBack });

  if (!wordQueue.length) {
    return (
      <div>
        <h2>Topic: {topic}</h2>
        <p>🎉 All words completed!</p>
        <button className="back-button" onClick={onBack}>
          Back to Topics
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Topic: {topic}</h2>

      <CompletedWordsList words={completedWords} />

      <ProgressBar current={wordsCompleted} total={totalWords} />

      <form onSubmit={handleSubmit} className="box centered-content">
        <p className="word">
          {currentWord?.languageA}{' '}
          {isInCorrectionMode && (
            <span className="correction-text">- {currentWord?.languageB}</span>
          )}
        </p>

        <div className="form-row">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>

      {feedback && <p style={{ textAlign: 'center' }}>{feedback}</p>}

      <button className="back-button" onClick={onBack}>
        Back to Topics
      </button>
    </div>
  );
};

export default VocabQuiz;
