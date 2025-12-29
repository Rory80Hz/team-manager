import { useState, useEffect, useRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { 
  DndContext, 
  type DragEndEvent, 
  DragOverlay, 
  type DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import html2canvas from 'html2canvas';
import type { Player, Position } from '../types';
import { INITIAL_POSITIONS } from '../constants';
import { PlayerList } from './PlayerList';
import { TeamSheet } from './TeamSheet';
import { PlayerCardView } from './PlayerCard';
import { toCSV, parseCSV } from '../utils/csv';
import '../App.css'
import { useNavigate, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export function TeamManager() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  // Initialize state
  const [players, setPlayers] = useState<Player[]>(() => {
    if (teamId) return []; // Load from cloud if teamId exists
    
    // Legacy localStorage logic
    const globalPlayers = localStorage.getItem('players');
    if (globalPlayers) return JSON.parse(globalPlayers);
    
    return [];
  });

  // Load from Cloud
  useEffect(() => {
    if (!teamId) return;
    
    client.models.Team.get({ id: teamId }).then(({ data: team }) => {
        if (team && team.players) {
            setPlayers(team.players as unknown as Player[]);
        }
    });
  }, [teamId]);

  const [activeId, setActiveId] = useState<string | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Enable click events
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Delay to prevent accidental drags while scrolling
        tolerance: 5,
      },
    })
  );

  // Save to storage whenever state changes
  useEffect(() => {
    if (teamId) {
        const timeout = setTimeout(() => {
            client.models.Team.update({
                id: teamId,
                players: players as unknown as any
            });
        }, 1000);
        return () => clearTimeout(timeout);
    } else {
        localStorage.setItem('players', JSON.stringify(players));
    }
  }, [players, teamId]);

  // Derive positions from players state and INITIAL_POSITIONS constant
  const positions = useMemo(() => {
    return INITIAL_POSITIONS.map(pos => {
      const player = players.find(p => p.positionId === pos.id);
      return {
        ...pos,
        playerId: player ? player.id : null
      };
    });
  }, [players]);

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      positionId: null
    };
    setPlayers([...players, newPlayer]);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
    }
  };

  const handleUpdatePlayerName = (id: string, newName: string) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, name: newName } : p
    ));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active) {
      const playerId = active.id as string;
      const targetPositionId = over.id as string;

      setPlayers(prevPlayers => {
        return prevPlayers.map(p => {
          // If this is the player being dragged
          if (p.id === playerId) {
            return { ...p, positionId: targetPositionId };
          }
          
          // If another player is ALREADY in targetPositionId, we need to unassign them.
          if (p.positionId === targetPositionId && p.id !== playerId) {
            return { ...p, positionId: null };
          }
          
          return p;
        });
      });
    }
  };

  const handleRemovePlayerFromPosition = (positionId: string) => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(p => {
        if (p.positionId === positionId) {
          return { ...p, positionId: null };
        }
        return p;
      });
    });
  };

  const availablePlayers = players.filter(p => !p.positionId);

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportData = () => {
    // Export all players with their position (if any)
    const data = players.map(p => ({
      id: p.id,
      name: p.name,
      positionId: p.positionId || ''
    }));
    const csv = toCSV(data, ['id', 'name', 'positionId']);
    downloadCSV(csv, 'team_data.csv');
  };

  const teamSheetRef = useRef<HTMLDivElement>(null);

  const handleExportImage = async () => {
    if (teamSheetRef.current) {
      try {
        const canvas = await html2canvas(teamSheetRef.current, {
          useCORS: true, // In case we have external images (like the logo if it was external)
          scale: 2, // Better quality
          backgroundColor: '#ffffff', // Ensure white background
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'team-sheet.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to export image:', error);
        alert('Failed to export image. See console for details.');
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCSV(text);
      
      // Expected format: id, name, positionId
      const newPlayers: Player[] = data.map((row: any) => ({
        id: row.id || uuidv4(),
        name: row.name,
        positionId: row.positionId || null
      })).filter(p => p.name);
      
      setPlayers(prev => {
        const playerMap = new Map(prev.map(p => [p.id, p]));
        newPlayers.forEach(p => playerMap.set(p.id, p));
        return Array.from(playerMap.values());
      });
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetTeam = () => {
    if (confirm('Are you sure you want to reset the team? All players will be moved back to the available list.')) {
      setPlayers(prev => prev.map(p => ({ ...p, positionId: null })));
    }
  };

  const activePlayer = activeId ? players.find(p => p.id === activeId) : null;

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="app-container">
        <header className="app-header">
            <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src="/fav.svg" alt="Logo" className="app-logo" />
                <h1>Team Manager</h1>
            </div>
            <div className="header-actions">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".csv" 
                  onChange={handleImportData} 
                />
                
                <div className="button-group">
                  <button onClick={() => fileInputRef.current?.click()}>Import Data</button>
                  <button onClick={exportData}>Export Data</button>
                  <button onClick={handleExportImage}>Export Image</button>
                </div>

                <button onClick={resetTeam} style={{ backgroundColor: '#ff9800' }}>Reset Team</button>
                <button onClick={() => {
                    if(confirm('Are you sure you want to clear all data? This will delete all players.')) {
                        setPlayers([]);
                    }
                }} className="danger-button">Clear Data</button>
            </div>
        </header>
        <div className="main-content">
          <PlayerList 
            players={availablePlayers} 
            onAddPlayer={handleAddPlayer} 
            onDeletePlayer={handleDeletePlayer}
            onUpdatePlayerName={handleUpdatePlayerName}
          />
          <div className="team-sheet-wrapper">
            <TeamSheet 
              ref={teamSheetRef}
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
