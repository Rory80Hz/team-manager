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
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ width: '150px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{position.id}. {position.name}</span>
      </div>
      <button 
          onClick={onToggleDisabled}
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
            justifyContent: 'center'
          }}
          title={position.disabled ? "Enable position" : "Disable position"}
        >
          {position.disabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          )}
        </button>
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
