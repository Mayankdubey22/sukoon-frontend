import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, ArrowLeft } from 'lucide-react';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { SearchProvider, useSearch } from './SearchContext';
import { LibraryProvider } from './LibraryContext';
import Sidebar from './components/Sidebar';
import NowPlayingSidebar from './components/NowPlayingSidebar';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import HomePage from './pages/HomePage';
import Carousel from './components/Carousel';
import './App.css';
import PlaylistPage from './pages/PlaylistPage';
import LocalPlaylistPage from './pages/LocalPlaylistPage';
import AddToPlaylistButton from './components/AddToPlaylistButton';
import LikedSongsPage from './pages/LikedSongsPage';
import { Play as PlayIcon } from 'lucide-react';
import { API_BASE_URL } from './config'; // adjust path: use './config' if the file is directly in src/


const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function MainContent() {
  const { query, results, loading, updateQuery } = useSearch();
  const navigate = useNavigate();
  const { playSong, currentSong, playQueue } = usePlayer();

  const handlePlayArtist = async (e, artistId) => {
    e.stopPropagation();
    try {
      const res = await axios.get(`${API_BASE_URL}/api/songs/artist/${artistId}`);
      const topSongs = res.data.data.topSongs || [];
      if (topSongs.length > 0) playQueue(topSongs, 0);
    } catch (err) {
      console.error('Failed to play artist:', err);
    }
  };

  const handlePlayPlaylist = async (e, playlistId) => {
    e.stopPropagation();
    try {
      const res = await axios.get(`${API_BASE_URL}/api/songs/playlist/${playlistId}`);
      const songs = res.data.data.songs || [];
      if (songs.length > 0) playQueue(songs, 0);
    } catch (err) {
      console.error('Failed to play playlist:', err);
    }
  };

  return (
    <div className="main-content">
      {loading && <p className="loading-text">Searching...</p>}

      {!query.trim() && !loading && <HomePage />}

      {results && (
        <div className="results-container">

          {results.topQuery?.results?.length > 0 && (
            <div className="section">
              <h2>Top Result</h2>
              <div
                className="top-result-card"
                onClick={() => {
                  const item = results.topQuery.results[0];
                  if (item.type === 'song') playSong(item);
                  else if (item.type === 'album') navigate(`/album/${item.id}`);
                  else if (item.type === 'artist') navigate(`/artist/${item.id}`);
                }}
              >
                <img src={results.topQuery.results[0].image?.[2]?.url} alt="" />
                <div>
                  <p className="top-result-name">{decodeHtml(results.topQuery.results[0].name || results.topQuery.results[0].title)}</p>
                  <p className="top-result-type">{results.topQuery.results[0].type}</p>
                </div>
              </div>
            </div>
          )}

          {results.songs?.results?.length > 0 && (
            <div className="section">
              <h2>Songs</h2>
              <div className="song-list">
                {results.songs.results.slice(0, 5).map((song) => (
                  <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}>
                    <div className="song-item-main" onClick={() => playSong(song)}>
                      <img src={song.image?.[1]?.url} alt={song.title} />
                      <div>
                        <p className="song-name">{decodeHtml(song.title)}</p>
                        <p className="song-artist">{decodeHtml(song.primaryArtists || '')}</p>
                      </div>
                    </div>
                    <AddToPlaylistButton song={song} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.artists?.results?.length > 0 && (
            <div className="section">
              <h2>Artists</h2>
              <Carousel
                items={results.artists.results}
                renderItem={(artist) => (
                  <div key={artist.id} className="artist-card" onClick={() => navigate(`/artist/${artist.id}`)}>
                    <div className="card-image-wrapper artist-image-wrapper">
                      <img
                        src={artist.image?.[2]?.url || artist.image?.[1]?.url || artist.image?.[0]?.url}
                        alt={artist.title}
                        className="artist-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Artist'; }}
                      />
                      <div className="play-overlay" onClick={(e) => handlePlayArtist(e, artist.id)}>
                        <Play size={20} fill="black" />
                      </div>
                    </div>
                    <p>{decodeHtml(artist.title)}</p>
                  </div>
                )}
              />
            </div>
          )}

          {results.albums?.results?.length > 0 && (
            <div className="section">
              <h2>Albums</h2>
              <Carousel
                items={results.albums.results}
                renderItem={(album) => (
                  <div key={album.id} className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
                    <div className="card-image-wrapper">
                      <img src={album.image?.[1]?.url} alt={album.title || album.name} />
                      <div className="play-overlay">
                        <Play size={20} fill="black" />
                      </div>
                    </div>
                    <p className="card-title">{decodeHtml(album.title || album.name)}</p>
                    <p className="card-subtitle">{album.year || 'Album'}</p>
                  </div>
                )}
              />
            </div>
          )}

          {results.playlists?.results?.length > 0 && (
            <div className="section">
              <h2>Playlists</h2>
              <Carousel
                items={results.playlists.results}
                renderItem={(playlist) => (
                  <div key={playlist.id} className="album-card" onClick={() => navigate(`/playlist/${playlist.id}`)}>
                    <div className="card-image-wrapper">
                      <img src={playlist.image?.[1]?.url} alt={playlist.title || playlist.name} />
                      <div className="play-overlay" onClick={(e) => handlePlayPlaylist(e, playlist.id)}>
                        <Play size={20} fill="black" />
                      </div>
                    </div>
                    <p className="card-title">{decodeHtml(playlist.title || playlist.name)}</p>
                    <p className="card-subtitle">Playlist</p>
                  </div>
                )}
              />
            </div>
          )}

        </div>
      )}
    </div>
  );
}

function Layout() {
  const { query, updateQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnHome = location.pathname === '/' && !query.trim();

  const goHome = () => {
    updateQuery('');
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-logo">🎵 Sukoon</h1>

        <div className="search-section">
          <button
            className="back-arrow-btn"
            onClick={goHome}
            style={{ visibility: isOnHome ? 'hidden' : 'visible' }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="search-bar">
            <input
  type="text"
  placeholder="What do you want to listen to?"
  value={query}
  onChange={(e) => {
    const value = e.target.value;
    updateQuery(value);
    if (value.trim() && location.pathname !== '/') {
      navigate('/');
    }
  }}
/>
          </div>
        </div>

        <div className="header-spacer"></div>
      </header>

      <div className="app-body">
        <Sidebar />
        <div className="page-fade" key={location.pathname}>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/playlist/local/:id" element={<LocalPlaylistPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
          </Routes>
        </div>
        <NowPlayingSidebar />
      </div>

      <GlobalPlayer />
    </div>
  );
}

function GlobalPlayer() {
  const { currentSong, playNext, playPrevious, toggleShuffle, isShuffled, repeatMode, toggleRepeat, currentIndex, queue } = usePlayer();
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(audioRef.current.duration);
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-bar">
      <audio
        ref={audioRef}
        src={currentSong.downloadUrl?.[4]?.url || currentSong.downloadUrl?.[0]?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
        autoPlay
      />

      <div className="player-left">
        <img src={currentSong.image?.[1]?.url} alt={currentSong.name} className="player-thumb" />
        <div className="player-song-info">
          <p className="player-song-name">{decodeHtml(currentSong.name)}</p>
          <p className="player-song-artist">{decodeHtml(currentSong.artists?.primary?.map(a => a.name).join(', ') || '')}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-buttons">
          <button className={`icon-btn ${isShuffled ? 'active' : ''}`} onClick={toggleShuffle}>
            <Shuffle size={18} />
          </button>
          <button className="icon-btn" onClick={playPrevious} disabled={currentIndex <= 0}>
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
          </button>
          <button className="icon-btn" onClick={playNext} disabled={currentIndex >= queue.length - 1}>
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button
            className={`icon-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
            {repeatMode === 'one' && <span className="repeat-one-dot">1</span>}
          </button>
          <AddToPlaylistButton song={currentSong} openUpward={true} />
        </div>

        <div className="progress-row">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
            style={{ background: `linear-gradient(to right, #1db954 ${(currentTime / (duration || 1)) * 100}%, #4d4d4d ${(currentTime / (duration || 1)) * 100}%)` }}
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <Volume2 size={18} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-bar"
          style={{ background: `linear-gradient(to right, #1db954 ${volume * 100}%, #4d4d4d ${volume * 100}%)` }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <PlayerProvider>
      <SearchProvider>
        <LibraryProvider>
          <Layout />
        </LibraryProvider>
      </SearchProvider>
    </PlayerProvider>
  );
}

export default App;