import React from 'react';

interface StatusBadgeProps {
  status?: string;
  actual: number;
  target: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ actual, target }) => {
  const getStatusInfo = () => {
    if (actual >= target) {
      return {
        text: 'Hoàn thành',
        className: 'badge-success',
      };
    }
    if (actual > 0) {
      return {
        text: 'Đang thực hiện',
        className: 'badge-warning',
      };
    }
    return {
      text: 'Chưa thăm',
      className: 'badge-gray',
    };
  };

  const info = getStatusInfo();

  return <span className={`badge ${info.className}`}>{info.text}</span>;
};

export default StatusBadge;
