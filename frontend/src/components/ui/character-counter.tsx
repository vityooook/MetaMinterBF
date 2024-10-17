import React from 'react';

interface CharacterCounterProps {
  current: number;
  max?: number;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, max }) => {
  if (!max) return null;

  return (
    <span className="absolute right-2 bottom-1 text-xs text-muted-foreground">
      {current}/{max}
    </span>
  );
};
