import React, { forwardRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Player } from '../types';

interface Props {
  player: Player;
}

interface ViewProps {
  player: Player;
  style?: React.CSSProperties;
  isOverlay?: boolean;
  [key: string]: any;
}

export const PlayerCardView = forwardRef<HTMLDivElement, ViewProps>(({ player, style, isOverlay, ...props }, ref) => {
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
      ...style
    }} {...props}>
      {player.name}
    </div>
  );
});

export const PlayerCard: React.FC<Props> = ({ player }) => {
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
      {...listeners} 
      {...attributes} 
    />
  );
};
