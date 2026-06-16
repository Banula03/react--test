import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: any) => {
    setError(err?.message || 'An unexpected error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
