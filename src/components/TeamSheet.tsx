import { forwardRef } from 'react';
import type { Position, Player } from '../types';
import { PositionSlot } from './PositionSlot';
import { PitchPosition } from './PitchPosition';
import './TeamSheet.css';

interface Props {
  positions: Position[];
  players: Player[];
  onRemovePlayer: (positionId: string) => void;
  onToggleDisabled: (positionId: string) => void;
}

// Coordinates for positions 1-15 (percentage from top, percentage from left)
const PITCH_COORDINATES: Record<string, { top: string; left: string }> = {
  '1': { top: '15%', left: '35%' },
  '2': { top: '15%', left: '50%' },
  '3': { top: '15%', left: '65%' },
  '4': { top: '28%', left: '42%' },
  '5': { top: '28%', left: '58%' },
  '6': { top: '30%', left: '25%' },
  '7': { top: '30%', left: '75%' },
  '8': { top: '40%', left: '50%' },
  '9': { top: '50%', left: '40%' },
  '10': { top: '60%', left: '30%' },
  '12': { top: '60%', left: '50%' },
  '13': { top: '65%', left: '65%' },
  '11': { top: '70%', left: '15%' },
  '14': { top: '70%', left: '85%' },
  '15': { top: '85%', left: '50%' },
};

export const TeamSheet = forwardRef<HTMLDivElement, Props>(({ positions, players, onRemovePlayer, onToggleDisabled }, ref) => {
  const getPlayer = (playerId: string | null) => {
    if (!playerId) return null;
    return players.find(p => p.id === playerId) || null;
  };

  const startingXV = positions.filter(p => parseInt(p.id) <= 15);
  const substitutes = positions.filter(p => parseInt(p.id) > 15);

  return (
    <div className="team-sheet-container" ref={ref}>
      <h2>Team Sheet</h2>
      
      {/* Pitch View */}
      <div className="pitch-container">
        {/* Pitch Markings */}
        <div className="pitch-line halfway" />
        <div className="pitch-line twenty-two-top" />
        <div className="pitch-line twenty-two-bottom" />
        <div className="pitch-line ten-meter-top" />
        <div className="pitch-line ten-meter-bottom" />
        <div className="pitch-line try-line-top" />
        <div className="pitch-line try-line-bottom" />

        {startingXV.map(position => (
          <PitchPosition
            key={position.id}
            position={position}
            player={getPlayer(position.playerId)}
            style={PITCH_COORDINATES[position.id]}
            onRemove={() => onRemovePlayer(position.id)}
            onToggleDisabled={() => onToggleDisabled(position.id)}
          />
        ))}
      </div>

      {/* Bench */}
      <h3>Substitutes</h3>
      <div className="substitutes-grid">
        {substitutes.map(position => (
          <PositionSlot
            key={position.id}
            position={position}
            player={getPlayer(position.playerId)}
            onRemove={() => onRemovePlayer(position.id)}
            onToggleDisabled={() => onToggleDisabled(position.id)}
          />
        ))}
      </div>
    </div>
  );
});

