'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
      <div className="progress-text">
        {current}/{total}
      </div>
    </div>
  );
};

export default ProgressBar;
