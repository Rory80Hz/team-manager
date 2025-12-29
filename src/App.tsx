import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import type { Player, Position } from './types';
import { INITIAL_POSITIONS } from './constants';
import { PlayerList } from './components/PlayerList';
import { TeamSheet } from './components/TeamSheet';
import { PlayerCardView } from './components/PlayerCard';
import './App.css'

function App() {
  // Initialize state from localStorage if available, otherwise use defaults
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = localStorage.getItem('players');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [positions, setPositions] = useState<Position[]>(() => {
    const stored = localStorage.getItem('positions');
    return stored ? JSON.parse(stored) : INITIAL_POSITIONS;
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  // Save to storage whenever state changes
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [positions]);

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active) {
      const playerId = active.id as string;
      const positionId = over.id as string;

      // Find the player
      const player = players.find(p => p.id === playerId);
      if (!player) return;

      // Update positions
      setPositions(prevPositions => {
        const newPositions = [...prevPositions];
        
        // Remove player from any existing position
        const existingPositionIndex = newPositions.findIndex(p => p.playerId === playerId);
        if (existingPositionIndex !== -1) {
           newPositions[existingPositionIndex] = { ...newPositions[existingPositionIndex], playerId: null };
        }

        // Add player to new position
        const targetPositionIndex = newPositions.findIndex(p => p.id === positionId);
        if (targetPositionIndex !== -1) {
          newPositions[targetPositionIndex] = { ...newPositions[targetPositionIndex], playerId };
        }

        return newPositions;
      });
    }
  };

  const handleRemovePlayerFromPosition = (positionId: string) => {
    setPositions(prevPositions => {
      const newPositions = [...prevPositions];
      const targetIndex = newPositions.findIndex(p => p.id === positionId);
      if (targetIndex !== -1) {
        newPositions[targetIndex] = { ...newPositions[targetIndex], playerId: null };
      }
      return newPositions;
    });
  };

  const assignedPlayerIds = positions.map(p => p.playerId).filter(id => id !== null) as string[];
  const availablePlayers = players.filter(p => !assignedPlayerIds.includes(p.id));

  const exportAvailablePlayers = () => {
    const text = availablePlayers.map(p => p.name).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'available_players.txt';
    a.click();
  };

  const exportTeam = () => {
    const text = positions.map(p => {
      const player = players.find(pl => pl.id === p.playerId);
      return `${p.id}. ${p.name}: ${player ? player.name : 'Unassigned'}`;
    }).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team_sheet.txt';
    a.click();
  };

  const resetTeam = () => {
    if (confirm('Are you sure you want to reset the team? All players will be moved back to the available list.')) {
      setPositions(INITIAL_POSITIONS);
    }
  };

  const activePlayer = activeId ? players.find(p => p.id === activeId) : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app-container">
        <header className="app-header">
            <h1>Rugby Team Manager</h1>
            <div className="header-actions">
                <button onClick={exportAvailablePlayers}>Export Players</button>
                <button onClick={exportTeam}>Export Team</button>
                <button onClick={resetTeam} style={{ backgroundColor: '#ff9800' }}>Reset Team</button>
                <button onClick={() => {
                    if(confirm('Are you sure you want to clear all data? This will delete all players.')) {
                        setPlayers([]);
                        setPositions(INITIAL_POSITIONS);
                    }
                }} className="danger-button">Clear Data</button>
            </div>
        </header>
        <div className="main-content">
          <PlayerList players={availablePlayers} onAddPlayer={handleAddPlayer} />
          <div className="team-sheet-wrapper">
            <TeamSheet 
              positions={positions} 
              players={players} 
              onRemovePlayer={handleRemovePlayerFromPosition}
            />
          </div>
        </div>
      </div>
      <DragOverlay>
        {activePlayer ? <PlayerCardView player={activePlayer} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default App
