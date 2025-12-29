import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Player } from '../types';

interface Props {
  player: Player;
  onDelete?: () => void;
  onUpdateName?: (name: string) => void;
}

interface ViewProps {
  player: Player;
  style?: React.CSSProperties;
  isOverlay?: boolean;
  onDelete?: () => void;
  onUpdateName?: (name: string) => void;
  [key: string]: any;
}

export const PlayerCardView = forwardRef<HTMLDivElement, ViewProps>(({ player, style, isOverlay, onDelete, onUpdateName, ...props }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editName.trim() && onUpdateName) {
      onUpdateName(editName.trim());
    } else {
      setEditName(player.name);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(player.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
    e.stopPropagation();
  };

  return (
    <div ref={ref} style={{
      padding: '10px',
      margin: '5px 0',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: isOverlay ? 'grabbing' : 'grab',
      boxShadow: isOverlay ? '0 5px 15px rgba(0,0,0,0.15)' : 'none',
      opacity: isOverlay ? 0.8 : 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '42px',
      ...style
    }} {...props}>
      {isEditing && !isOverlay ? (
        <input
          ref={inputRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            padding: '4px',
            border: '1px solid #999',
            borderRadius: '2px',
            fontSize: 'inherit'
          }}
        />
      ) : (
        <>
          <span 
            onDoubleClick={(e) => {
                if (onUpdateName && !isOverlay) {
                    e.stopPropagation();
                    setIsEditing(true);
                }
            }}
            style={{ flex: 1, marginRight: '8px', userSelect: 'none' }}
          >
            {player.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {onUpdateName && !isOverlay && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        fontSize: '14px',
                        cursor: 'pointer',
                        padding: '0 4px',
                        lineHeight: 1,
                    }}
                    title="Edit name"
                >
                    ✎
                </button>
            )}
            {onDelete && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ff4444',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '0 4px',
                    lineHeight: 1,
                    marginLeft: '4px'
                }}
                title="Delete player"
                >
                ×
                </button>
            )}
          </div>
        </>
      )}
    </div>
  );
});

export const PlayerCard: React.FC<Props> = ({ player, onDelete, onUpdateName }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { player }
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <PlayerCardView 
      ref={setNodeRef} 
      player={player} 
      style={style} 
      onDelete={onDelete}
      onUpdateName={onUpdateName}
      {...listeners} 
      {...attributes} 
    />
  );
};
