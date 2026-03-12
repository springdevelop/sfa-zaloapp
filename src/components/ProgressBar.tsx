import React from 'react';
import { Text } from './UIComponents';
import { calculateProgress } from '../utils/helpers';

interface ProgressBarProps {
  actual: number;
  target: number;
  showLabel?: boolean;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  actual, 
  target, 
  showLabel = true, 
  height = 8 
}) => {
  const progress = calculateProgress(actual, target);
  
  const getColor = () => {
    if (progress >= 100) return '#00c851';
    if (progress >= 50) return '#ffbb33';
    return '#ff4444';
  };

  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <Text size="small">Tiến độ</Text>
          <Text size="small" bold>
            {actual} / {target}
          </Text>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: '#f5f5f5',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: getColor(),
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
