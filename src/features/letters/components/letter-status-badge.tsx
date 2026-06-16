import React from 'react';

interface LetterStatusBadgeProps {
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export const LetterStatusBadge: React.FC<LetterStatusBadgeProps> = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'approved': return 'chip-success';
      case 'pending': return 'chip-warning';
      case 'rejected': return 'chip-danger';
      default: return 'chip-default';
    }
  };

  return (
    <span className={`chip ${getBadgeClass()}`} style={{ textTransform: 'capitalize' }}>
      {status}
    </span>
  );
};
