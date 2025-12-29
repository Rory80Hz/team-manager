import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Position, Player } from '../types';
import './TeamSheet.css'; // Import the CSS

interface Props {
  position: Position;
  player: Player | null;
  style?: React.CSSProperties;
  onRemove: () => void;
}

export const PitchPosition: React.FC<Props> = ({ position, player, style, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: position.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`pitch-position ${isOver ? 'is-over' : ''}`}
      style={style}
    >
      <div className="pitch-position-number">{position.id}</div>
      <div className="pitch-position-name">{position.name}</div>
      {player ? (
        <div className="pitch-player-name" title={player.name}>
          {player.name}
          <button 
            className="remove-player-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove player"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="pitch-empty">Empty</div>
      )}
    </div>
  );
};
