import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export function LandingPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Array<Schema['Team']['type']>>([]);

  useEffect(() => {
    // Fetch teams
    const sub = client.models.Team.observeQuery().subscribe({
      next: ({ items }) => {
        setTeams([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const createTeam = async () => {
    const name = prompt("Enter team name");
    if (name) {
      const { data: newTeam, errors } = await client.models.Team.create({
        name,
        description: 'New Team',
      });
      if (errors) {
        console.error(errors);
        alert('Failed to create team');
      } else if (newTeam) {
        navigate(`/team/${newTeam.id}`);
      }
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="landing-container">
          <header className="app-header">
            <div className="logo-section">
                <img src="/fav.svg" alt="Logo" className="app-logo" />
                <h1>Team Manager</h1>
            </div>
            <div className="header-actions">
                <span>Welcome, {user?.signInDetails?.loginId}</span>
                <button onClick={signOut}>Sign Out</button>
            </div>
          </header>
          
          <div className="main-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Your Teams</h2>
                <button onClick={createTeam}>Create New Team</button>
            </div>
            
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
      )}
    </Authenticator>
  );
}
