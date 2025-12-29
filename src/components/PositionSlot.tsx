import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Position, Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
  position: Position;
  player: Player | null;
  onRemove: () => void;
}

export const PositionSlot: React.FC<Props> = ({ position, player, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: position.id,
  });

  const style = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    border: '1px dashed #ccc',
    backgroundColor: isOver ? '#e0ffe0' : '#fff',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ width: '150px', fontWeight: 'bold' }}>{position.id}. {position.name}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {player ? (
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
        )}
      </div>
    </div>
  );
};
