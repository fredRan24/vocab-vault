'use client';
import { useState, useEffect } from 'react';
import FolderTree, { TopicNode } from '@components/folderTree';

interface TopicSelectorProps {
  language: string;
  onSelect: (filePath: string) => void;
}

export default function TopicSelector({ language, onSelect }: TopicSelectorProps) {
  const [topics, setTopics] = useState<TopicNode[]>([]);

  useEffect(() => {
    fetch(`/api/topics?language=${language}`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics || []))
      .catch((err) => {
        console.error('Failed to fetch topics:', err);
        setTopics([]);
      });
  }, [language]);

  const handleSelectFile = (filePath: string) => {
    onSelect(filePath);
  };

  return (
    <div>
      <h2>Select a Topic ({language})</h2>
      {topics.length === 0 ? (
        <p>Loading topics...</p>
      ) : (
        topics.map((node) => (
          <FolderTree key={node.path} node={node} onSelectFile={handleSelectFile} />
        ))
      )}
    </div>
  );
}
