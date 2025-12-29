import React, { useState } from 'react';
import type { Player } from '../types';
import { PlayerCard } from './PlayerCard';
import './PlayerList.css';

interface Props {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onDeletePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
}

export const PlayerList: React.FC<Props> = ({ players, onAddPlayer, onDeletePlayer, onUpdatePlayerName }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAdd = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  return (
    <div className="player-list-container">
      <h2 className="player-list-header">Available Players</h2>
      <div className="player-input-section">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="player-input"
        />
        <button onClick={handleAdd} className="add-player-btn">Add</button>
      </div>
      <div className="player-scroll-area">
        {players.length === 0 ? (
          <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
            No players available. Add some above!
          </div>
        ) : (
          players.map(player => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onDelete={() => onDeletePlayer(player.id)}
              onUpdateName={(name) => onUpdatePlayerName(player.id, name)}
            />
          ))
        )}
      </div>
    </div>
  );
};
