import { useEffect } from 'react';

export const useDeleteSelectedShape = (
  selectedId: string | null,
  handleRemove: (id: string) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        handleRemove(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, handleRemove]);
};
