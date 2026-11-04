import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MarketingLayout } from './components/layout/MarketingLayout';
import { Home } from './pages/Home';
import { GamePage } from './pages/GamePage';
import { RulesPage } from './pages/RulesPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
