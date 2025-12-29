import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Position, Player } from '../types';
import './TeamSheet.css'; // Import the CSS

interface Props {
  position: Position;
  player: Player | null;
  style?: React.CSSProperties;
  onRemove: () => void;
  onToggleDisabled: () => void;
}

export const PitchPosition: React.FC<Props> = ({ position, player, style, onRemove, onToggleDisabled }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: position.id,
    disabled: position.disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={`pitch-position ${isOver ? 'is-over' : ''} ${position.disabled ? 'is-disabled' : ''}`}
      style={{ ...style, opacity: position.disabled ? 0.5 : 1, backgroundColor: position.disabled ? '#eee' : undefined }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 5px' }}>
        <div className="pitch-position-number">{position.id}</div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleDisabled(); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '12px', 
            padding: 0,
            color: '#666'
          }}
        >
          {position.disabled ? '+' : '-'}
        </button>
      </div>
      <div className="pitch-position-name">{position.name}</div>
      {!position.disabled && (
        player ? (
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
        )
      )}
    </div>
  );
};
