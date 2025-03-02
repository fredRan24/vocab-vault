'use client';
import { useState, useEffect } from 'react';

interface VocabEntry {
  languageA: string;
  languageB: string;
}

const VocabQuiz = ({ language, topic }: { language: string; topic: string }) => {
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabEntry | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<string | null>(null);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  useEffect(() => {
    fetch(`/api/vocab?language=${language}&topic=${topic}`)
      .then((res) => res.json())
      .then((data) => {
        setVocab(data.vocab || []);
        if (data.vocab.length > 0) {
          setCurrentWord(data.vocab[0]);
        }
      });
  }, [language, topic]);

  const totalWords = vocab.length;
  const progressPercentage = totalWords > 0 ? Math.round((wordsCompleted / totalWords) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord) return;

    const correct = userInput.trim().toLowerCase() === currentWord.languageB.toLowerCase();

    if (correct) {
      setFeedback('✅ Correct!');
      setCompletedWords((prev) => [currentWord.languageA, ...prev].slice(0, 5));
      setIsWrong(false);
      setShowCorrectAnswer(null);
      setWordsCompleted((prev) => prev + 1);

      // Move to next word
      const nextIndex = vocab.indexOf(currentWord) + 1;
      setCurrentWord(nextIndex < vocab.length ? vocab[nextIndex] : null);
    } else {
      setFeedback(`❌ Wrong!`);
      setIsWrong(true);
      setShowCorrectAnswer(currentWord.languageB);

      setTimeout(() => setIsWrong(false), 400);
    }

    setUserInput('');
  };

  return (
    <div>
      <h2>Topic: {topic}</h2>

      {/* Completed Words Box */}
      {completedWords.length > 0 && (
        <div className="box previous-answers">
          <strong>Last 5 Correct:</strong>
          <ul>
            {completedWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress Bar */}
      {totalWords > 0 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          <div className="progress-text">{progressPercentage}% Completed</div>
        </div>
      )}

      {/* Quiz Section */}
      {currentWord ? (
        <form onSubmit={handleSubmit} className="box">
          <p className="word">
            {currentWord.languageA}{' '}
            {showCorrectAnswer && <span style={{ color: 'red' }}> - {showCorrectAnswer}</span>}
          </p>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={`input-field ${isWrong ? 'wrong' : ''}`}
          />
          <button type="submit">
            Submit <span className="arrow">➡️</span>
          </button>
        </form>
      ) : (
        <p>🎉 All words completed!</p>
      )}

      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default VocabQuiz;
