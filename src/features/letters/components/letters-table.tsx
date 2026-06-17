import React from 'react';
import type { Letter } from '../types';
import { LetterStatusBadge } from './letter-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LettersTableProps {
  letters: Letter[];
  onViewDetails?: (letter: Letter) => void;
}

export const LettersTable: React.FC<LettersTableProps> = ({ letters, onViewDetails }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Recipient</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          {onViewDetails && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {letters.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No letters found. Create one to get started.
            </TableCell>
          </TableRow>
        ) : (
          letters.map((letter) => (
            <TableRow key={letter.id}>
              <TableCell>{new Date(letter.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium">{letter.recipientName}</TableCell>
              <TableCell>{letter.subject}</TableCell>
              <TableCell>
                <Badge variant={letter.letterType === 'with-facility' ? 'comprehensive' : 'standard'}>
                  {letter.letterType === 'with-facility' ? 'Comprehensive' : 'Standard'}
                </Badge>
              </TableCell>
              <TableCell>
                <LetterStatusBadge status={letter.status} />
              </TableCell>
              {onViewDetails && (
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(letter)}
                  >
                    View
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
