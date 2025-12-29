import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Position, Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
  position: Position;
  player: Player | null;
  onRemove: () => void;
  onToggleDisabled: () => void;
}

export const PositionSlot: React.FC<Props> = ({ position, player, onRemove, onToggleDisabled }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: position.id,
    disabled: position.disabled,
  });

  const style = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    border: '1px dashed #ccc',
    backgroundColor: position.disabled ? '#f5f5f5' : (isOver ? '#e0ffe0' : '#fff'),
    opacity: position.disabled ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ width: '150px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{position.id}. {position.name}</span>
        <button 
          onClick={onToggleDisabled}
          style={{ 
            background: 'none', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            cursor: 'pointer', 
            fontSize: '12px', 
            padding: '0 4px',
            color: '#666',
            marginLeft: 'auto',
            marginRight: '5px'
          }}
        >
          {position.disabled ? '+' : '-'}
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {!position.disabled && (
          player ? (
            <>
              <div style={{ flex: 1 }}>
                <PlayerCard player={player} />
              </div>
              <button 
                onClick={onRemove}
                style={{
                  marginLeft: '10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  padding: 0
                }}
                title="Remove player"
              >
                ×
              </button>
            </>
          ) : (
            <div style={{ color: '#999', fontStyle: 'italic' }}>Empty</div>
          )
        )}
        {position.disabled && <div style={{ color: '#999', fontStyle: 'italic' }}>Disabled</div>}
      </div>
    </div>
  );
};
