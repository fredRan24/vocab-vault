'use client';

import React from 'react';
import { CompletedWord } from '@/src/types';

interface CompletedWordsListProps {
  words: CompletedWord[];
}

const CompletedWordsList: React.FC<CompletedWordsListProps> = ({ words }) => {
  if (words.length === 0) return null;

  return (
    <div className="box previous-answers">
      <strong>Correct Words:</strong>
      <ul>
        {words.map((item, index) => (
          <li key={index}>
            {item.languageA} – {item.languageB}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedWordsList;
