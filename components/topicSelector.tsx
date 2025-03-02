'use client';
import { useEffect, useState } from 'react';

const TopicSelector = ({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (topic: string) => void;
}) => {
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/topics?language=${language}`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics || []));
  }, [language]);

  return (
    <div>
      <h2>Select a Topic ({language})</h2>
      <div className="grid-container">
        {topics.length === 0 ? (
          <p>Loading topics...</p>
        ) : (
          topics.map((topic) => (
            <div key={topic} className="grid-box" onClick={() => onSelect(topic)}>
              {topic}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopicSelector;
