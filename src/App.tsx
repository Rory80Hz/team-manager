import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { TeamManager } from './components/TeamManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/team/:teamId" element={<TeamManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

