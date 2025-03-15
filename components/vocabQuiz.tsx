'use client';

import { useState, useEffect } from 'react';

interface VocabEntry {
  languageA: string;
  languageB: string;
}

const VocabQuiz = ({
  language,
  topic,
  onBack,
}: {
  language: string;
  topic: string;
  onBack: () => void;
}) => {
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [wordQueue, setWordQueue] = useState<VocabEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isInCorrectionMode, setIsInCorrectionMode] = useState(false);
  const [wordToReinsert, setWordToReinsert] = useState<VocabEntry | null>(null);

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  useEffect(() => {
    fetch(`/api/vocab?language=${language}&topic=${topic}`)
      .then((res) => res.json())
      .then((data) => {
        const loaded = data.vocab || [];
        setVocab(loaded);
        setWordQueue(loaded);
      });
  }, [language, topic]);

  const totalWords = vocab.length;

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

  const currentWord = wordQueue[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord) return;

    const correct = userInput.trim().toLowerCase() === currentWord.languageB.toLowerCase();

    if (!isInCorrectionMode) {
      if (correct) {
        setWordQueue((prevQueue) => {
          const newQueue = [...prevQueue];
          newQueue.splice(currentIndex, 1);
          const newIndex = Math.min(currentIndex, newQueue.length - 1);
          setCurrentIndex(newIndex);
          return newQueue;
        });
        setFeedback('✅ Correct!');
        setCompletedWords((prev) => [...prev.slice(-4), currentWord.languageA]);
        setWordsCompleted((prev) => prev + 1);
      } else {
        setIsInCorrectionMode(true);
        setWordToReinsert(currentWord);
        setFeedback('❌ Wrong! Please type the correct answer shown.');
      }
    } else {
      if (correct) {
        if (wordToReinsert) {
          setWordQueue((prevQueue) => {
            const newQueue = [...prevQueue];
            newQueue.splice(currentIndex, 1);
            const insertPosition = Math.min(currentIndex + 5, newQueue.length);
            newQueue.splice(insertPosition, 0, wordToReinsert);

            const newIndex = Math.min(currentIndex, newQueue.length - 1);
            setCurrentIndex(newIndex);
            return newQueue;
          });
        }
        setIsInCorrectionMode(false);
        setWordToReinsert(null);
        setFeedback('✅ Correct (with help). Word will reappear later!');
      } else {
        setFeedback('❌ Still incorrect. Please match the shown translation.');
      }
    }

    setUserInput('');
  };

  return (
    <div>
      <h2>Topic: {topic}</h2>

      {completedWords.length > 0 && (
        <div className="box previous-answers">
          <strong>Last 5 Correct:</strong>
          <ul>
            {completedWords.slice(-5).map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}

      {totalWords > 0 && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${(wordsCompleted / totalWords) * 100}%` }}
          />
          <div className="progress-text">
            {wordsCompleted}/{totalWords}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="box centered-content">
        <p className="word">
          {currentWord.languageA}{' '}
          {isInCorrectionMode && <span className="correction-text">- {currentWord.languageB}</span>}
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
