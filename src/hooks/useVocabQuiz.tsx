'use client';
import { useState, useEffect } from 'react';
import { VocabEntry, CompletedWord } from '@/src/types';

interface UseVocabQuizProps {
  language: string;
  topic: string;
  onBack: () => void;
}

interface UseVocabQuizResult {
  wordQueue: VocabEntry[];
  currentIndex: number;
  isInCorrectionMode: boolean;
  wordToReinsert: VocabEntry | null;
  userInput: string;
  feedback: string | null;
  completedWords: CompletedWord[];
  wordsCompleted: number;
  totalWords: number;
  currentWord: VocabEntry | null;
  handleSubmit: (e: React.FormEvent) => void;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
}

export default function useVocabQuiz({
  language,
  topic,
  onBack,
}: UseVocabQuizProps): UseVocabQuizResult {
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [wordQueue, setWordQueue] = useState<VocabEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isInCorrectionMode, setIsInCorrectionMode] = useState(false);
  const [wordToReinsert, setWordToReinsert] = useState<VocabEntry | null>(null);

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  useEffect(() => {
    fetch(`/api/vocab?language=${language}&topic=${topic}`)
      .then((res) => res.json())
      .then((data) => {
        const loaded: VocabEntry[] = data.vocab || [];
        setVocab(loaded);
        setWordQueue(loaded);
      });
  }, [language, topic]);

  const totalWords = vocab.length;
  const currentWord = wordQueue[currentIndex] || null;

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

        setCompletedWords((prev) => [
          ...prev,
          { languageA: currentWord.languageA, languageB: currentWord.languageB },
        ]);
        setWordsCompleted((prev) => prev + 1);
        setFeedback('✅ Correct!');
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

  return {
    wordQueue,
    currentIndex,
    isInCorrectionMode,
    wordToReinsert,
    userInput,
    feedback,
    completedWords,
    wordsCompleted,
    totalWords,
    currentWord,
    handleSubmit,
    setUserInput,
    onBack,
  };
}
