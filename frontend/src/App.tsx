// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Library } from './pages/Library';
import { MovieDetails } from './pages/MovieDetails';
import { Search } from './pages/Search';
import { NotificationToast } from './components/common/NotificationToast';
import { Collections } from './pages/Collections';
import { CollectionDetails } from './pages/CollectionDetails';
import HealthCheck from './pages/HealthCheck';
import { Statistics } from './pages/Statistics';
import { GenreDetails } from './pages/GenreDetails';
import { Datacenter } from './pages/Datacenter';
import { Settings } from './pages/Settings';
import { Guide } from './pages/Guide';
import { useWebSocket } from './hooks/useWebSocket';
import { ActorDetails } from './pages/ActorDetails';
import { SeasonDetails } from './pages/SeasonDetails';
import { getScanStatus } from './services/api';
import { useScanStore } from './stores/scanStore';

const queryClient = new QueryClient();

function AppContent() {
  useWebSocket();

  // 🔥 Sincronizza lo stato di scansione all'avvio (fallback al WebSocket)
  useEffect(() => {
    getScanStatus()
      .then((res) => {
        if (res.data?.isScanning) {
          useScanStore.getState().startScan();
        }
      })
      .catch(() => {
        // Silenzioso: il WebSocket prenderà il sopravvento
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-netflix-black text-white">
        <NotificationToast />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<CollectionDetails />} />
          <Route path="/health-check" element={<HealthCheck />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/genre/:genre" element={<GenreDetails />} />
          <Route path="/datacenter" element={<Datacenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/actor/:name" element={<ActorDetails />} />
          <Route path="/season/:id" element={<SeasonDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;