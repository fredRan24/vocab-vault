'use client';
import { useState, useEffect } from 'react';

type TopicNode = {
  name: string;
  type: 'directory' | 'file';
  path: string;
  children?: TopicNode[];
};

function FolderTree({
  node,
  onSelectFile,
}: {
  node: TopicNode;
  onSelectFile: (filePath: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (node.type === 'directory') {
    return (
      <div>
        <div className="folder-header" onClick={() => setExpanded((prev) => !prev)}>
          <span className="arrow" style={{ marginRight: 8 }}>
            {expanded ? '▼' : '►'}
          </span>
          {node.name}
        </div>
        {expanded && node.children && (
          <div style={{ marginLeft: '1rem' }}>
            {node.children.map((child) => (
              <FolderTree key={child.path} node={child} onSelectFile={onSelectFile} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="file-item" onClick={() => onSelectFile(node.path)}>
      {node.name}
    </div>
  );
}

export default function TopicSelector({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (filePath: string) => void;
}) {
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
