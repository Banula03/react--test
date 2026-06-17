import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LetterStatusBadgeProps {
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export const LetterStatusBadge: React.FC<LetterStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'approved': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'rejected': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <Badge variant={getVariant()} className="capitalize">
      {status}
    </Badge>
  );
};
