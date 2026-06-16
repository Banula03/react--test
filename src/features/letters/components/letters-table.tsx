import React from 'react';
import type { Letter } from '../types';
import { LetterStatusBadge } from './letter-status-badge';

interface LettersTableProps {
  letters: Letter[];
  onViewDetails?: (letter: Letter) => void;
}

export const LettersTable: React.FC<LettersTableProps> = ({ letters, onViewDetails }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="account-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Subject</th>
            <th>Type</th>
            <th>Status</th>
            {onViewDetails && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {letters.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                No letters found. Create one to get started.
              </td>
            </tr>
          ) : (
            letters.map((letter) => (
              <tr key={letter.id}>
                <td>{new Date(letter.createdAt).toLocaleDateString()}</td>
                <td style={{ fontWeight: 500 }}>{letter.recipientName}</td>
                <td>{letter.subject}</td>
                <td>
                  <span className={`chip ${letter.letterType === 'with-facility' ? 'badge-comprehensive' : 'badge-standard'}`}>
                    {letter.letterType === 'with-facility' ? 'Comprehensive' : 'Standard'}
                  </span>
                </td>
                <td>
                  <LetterStatusBadge status={letter.status} />
                </td>
                {onViewDetails && (
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onViewDetails(letter)}
                    >
                      View
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
