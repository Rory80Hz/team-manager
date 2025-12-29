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
      <button 
          onClick={(e) => { e.stopPropagation(); onToggleDisabled(); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 0,
            color: position.disabled ? '#4caf50' : '#f44336',
            position: 'absolute',
            right: '2px',
            top: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          title={position.disabled ? "Enable position" : "Disable position"}
        >
          {position.disabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          )}
        </button>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 5px' }}>
        <div className="pitch-position-number">{position.id}</div>
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
