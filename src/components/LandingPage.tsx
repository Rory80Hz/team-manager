import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface Team {
  id: string;
  name: string;
  description: string;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Fetch teams from localStorage
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  const createTeam = () => {
    const name = prompt("Enter team name");
    if (name) {
      const newTeam: Team = {
        id: uuidv4(),
        name,
        description: 'New Team',
      };
      
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      localStorage.setItem('teams', JSON.stringify(updatedTeams));
      navigate(`/team/${newTeam.id}`);
    }
  };

  return (
    <div className="landing-container">
      <header className="app-header">
        <div className="logo-section">
            <img src="/fav.svg" alt="Logo" className="app-logo" />
            <h1>Team Manager</h1>
        </div>
        <div className="header-actions">
            <button onClick={createTeam}>Create New Team</button>
        </div>
      </header>
      
      <div className="main-content" style={{ padding: '2rem', flexDirection: 'column', overflowY: 'auto' }}>
        <h2>Your Teams</h2>
        
        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {teams.length === 0 && <p>No teams found. Create one to get started!</p>}
          {teams.map(team => (
            <div 
              key={team.id} 
              className="team-card" 
              style={{ 
                border: '1px solid #ccc', 
                padding: '1rem', 
                borderRadius: '8px', 
                cursor: 'pointer',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate(`/team/${team.id}`)}
            >
              <h3 style={{ marginTop: 0 }}>{team.name}</h3>
              <p style={{ color: '#666' }}>{team.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
