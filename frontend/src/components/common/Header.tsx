// src/components/common/Header.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getRandomMedia, scanLibrary } from '@/services/api';
import { useScanStore } from '@/stores/scanStore';
import { ScanProgressBar } from './ScanProgressBar';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const isScanning = useScanStore((s) => s.isScanning);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleScan = async () => {
    const store = useScanStore.getState();
    if (store.isScanning) return;

    // 🔥 Avvio ottimistico: la barra appare immediatamente
    store.startScan();

    try {
      await scanLibrary();
      queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error) {
      console.error('Errore scansione:', error);
    } finally {
      // Anche il WebSocket emetterà 'scan-completed', ma questo garantisce
      // lo stop locale in caso di disconnessione WS.
      useScanStore.getState().endScan();
    }
  };

  const handleRandomMovie = async () => {
    try {
      setIsLoadingRandom(true);
      const media = await getRandomMedia();

      if (!media?.id) {
        alert('Nessun contenuto trovato nella libreria.');
        return;
      }

      // 🔥 Se è una serie TV → vai alla prima stagione (opzione A)
      if (media.type === 'SERIES' && media.seasonId) {
        navigate(`/season/${media.seasonId}`);
        return;
      }

      // Altrimenti è un film → pagina dettaglio
      navigate(`/movie/${media.id}`);
    } catch (error) {
      console.error('Errore nel recuperare il contenuto casuale:', error);
      alert('Errore nel recuperare il contenuto casuale. Riprova più tardi.');
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collections', label: 'Collezioni' },
    { to: '/datacenter', label: 'Datacenter' },
    { to: '/statistics', label: 'Statistiche' },
    { to: '/health-check', label: 'Health Check' },
    { to: '/settings', label: 'Impostazioni' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 
      bg-gradient-to-b from-black from-70% to-transparent 
      px-2 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold hover:scale-105 transition-transform"
        >
          <img src="/icons/icon_home.svg" className="w-10 h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-0 text-sm">
          {navLinks.map((link, index) => (
            <div key={link.to} className="flex items-center">
              <Link to={link.to} className="nav-link">
                {link.label}
              </Link>
              {index < navLinks.length - 1 && (
                <span className="w-px h-6 bg-gradient-to-b 
                  from-transparent via-gray-500/70 to-transparent" />
              )}
            </div>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca titoli, attori, generi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white 
                placeholder-gray-400 rounded-full py-2 px-4 pr-10 
                border border-white/20 focus:border-gold 
                focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <img src="/icons/icon_search.svg" alt="Cerca" className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm 
              font-medium text-white
              border border-gray-800/200 bg-yellow-600
              transition-all duration-200
              hover:scale-105 hover:bg-yellow-700 hover:border-gray-800/200
              disabled:opacity-60 disabled:cursor-not-allowed 
              disabled:hover:scale-100
            `}
          >
            <img src="/icons/icon_scan.svg" alt="Scansiona" className="w-5 h-5" />
            {isScanning ? 'Scansione...' : 'Scansiona'}
          </button>

          <button
            onClick={handleRandomMovie}
            disabled={isLoadingRandom}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white
              border border-gray-800/200 bg-purple-700
              transition-all duration-200
              hover:scale-105 hover:bg-purple-800 hover:border-gray-800/200
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
          >
            {isLoadingRandom ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <img src="/icons/icon_random.svg" alt="Casuale" className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Casuale</span>
          </button>

          <Link
            to="/guide"
            className="p-2 text-gray-300 hover:text-white transition-all duration-200 rounded-full hover:scale-110 hover:bg-white/10"
            title="Guida all'uso"
            aria-label="Guida"
          >
            <img src="/icons/icon_guide.svg" alt="Guida" className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* 🔥 Barra di scansione animata (appare solo durante la scansione) */}
      <ScanProgressBar />
    </header>
  );
}