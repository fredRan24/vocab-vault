'use client';

import { useState, useEffect } from 'react';

interface VocabularyEntry {
  languageA: string;
  languageB: string;
}

const VocabLoader = () => {
  const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vocab')
      .then((response) => response.json())
      .then((data) => setVocabulary(data.vocabulary || []))
      .catch(() => setError('Failed to load vocabulary.'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Loaded Vocabulary</h2>
      <ul>
        {vocabulary.map((entry, index) => (
          <li key={index}>
            {entry.languageA} → {entry.languageB}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabLoader;
