'use client';
import { useEffect, useState } from 'react';

const LanguageSelector = ({ onSelect }: { onSelect: (language: string) => void }) => {
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/languages')
      .then((res) => res.json())
      .then((data) => setLanguages(data.languages || []));
  }, []);

  return (
    <div>
      <h2>Select a Language</h2>
      <div className="grid-container">
        {languages.length === 0 ? (
          <p>Loading languages...</p>
        ) : (
          languages.map((language) => (
            <div key={language} className="grid-box" onClick={() => onSelect(language)}>
              {language}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
