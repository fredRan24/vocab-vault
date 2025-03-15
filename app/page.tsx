'use client';
import { useState } from 'react';
import LanguageSelector from '@/components/languageSelector';
import TopicSelector from '@/components/topicSelector';
import VocabQuiz from '@/components/vocabQuiz';
import '@/app/globals.css';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <div className="container">
      <h1>VOCAB VAULT</h1>

      {!selectedLanguage ? (
        <LanguageSelector onSelect={setSelectedLanguage} />
      ) : !selectedTopic ? (
        <TopicSelector language={selectedLanguage} onSelect={setSelectedTopic} />
      ) : (
        <VocabQuiz
          language={selectedLanguage}
          topic={selectedTopic}
          onBack={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
}
