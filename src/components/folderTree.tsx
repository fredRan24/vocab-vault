'use client';
import { useState } from 'react';

export type TopicNode = {
  name: string;
  type: 'directory' | 'file';
  path: string;
  children?: TopicNode[];
};

interface FolderTreeProps {
  node: TopicNode;
  onSelectFile: (filePath: string) => void;
}

export default function FolderTree({ node, onSelectFile }: FolderTreeProps) {
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
