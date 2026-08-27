import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  ArrowLeft,
  Home,
  Search,
  Heart,
  Library,
} from 'lucide-react';

import {
  PlayerProvider,
  usePlayer,
} from './PlayerContext';

import {
  SearchProvider,
  useSearch,
} from './SearchContext';

import { LibraryProvider } from './LibraryContext';

import Sidebar from './components/Sidebar';
import NowPlayingSidebar from './components/NowPlayingSidebar';
import AddToPlaylistButton from './components/AddToPlaylistButton';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import PlaylistPage from './pages/PlaylistPage';
import LocalPlaylistPage from './pages/LocalPlaylistPage';
import LikedSongsPage from './pages/LikedSongsPage';
import LibraryPage from './pages/LibraryPage';

import './App.css';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text || '';
  return txt.value;
};

function MainContent() {
  const {
    query,
    loading,
    error,
  } = useSearch();

  if (!query.trim()) {
    return <HomePage />;
  }

  return (
    <SearchPage
      loading={loading}
      error={error}
    />
  );
}

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { query, updateQuery } = useSearch();

  const goHome = () => {
    updateQuery('');
    navigate('/');
  };

  const goSearch = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }

    // Focus the search input after navigation.
    setTimeout(() => {
      const searchInput =
        document.querySelector(
          '.search-bar input'
        );

      searchInput?.focus();
    }, 100);
  };

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={
          location.pathname === '/' &&
          !query.trim()
            ? 'active'
            : ''
        }
        onClick={goHome}
      >
        <Home size={21} />
        <span>Home</span>
      </button>

      <button
        className={
          location.pathname === '/' &&
          query.trim()
            ? 'active'
            : ''
        }
        onClick={goSearch}
      >
        <Search size={21} />
        <span>Search</span>
      </button>

      <button
        className={
          location.pathname === '/liked'
            ? 'active'
            : ''
        }
        onClick={() => {
          updateQuery('');
          navigate('/liked');
        }}
      >
        <Heart size={21} />
        <span>Liked</span>
      </button>

      <button
        className={
          location.pathname === '/library'
            ? 'active'
            : ''
        }
        onClick={() => {
          updateQuery('');
          navigate('/library');
        }}
      >
        <Library size={21} />
        <span>Library</span>
      </button>
    </nav>
  );
}

function Layout() {
  const {
    query,
    updateQuery,
  } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();

  const isOnHome =
    location.pathname === '/' &&
    !query.trim();

  const goHome = () => {
    updateQuery('');
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    updateQuery(value);

    if (
      value.trim() &&
      location.pathname !== '/'
    ) {
      navigate('/');
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1
          className="app-logo"
          onClick={goHome}
          title="Go to home"
        >
          🎵 Sukoon
        </h1>

        <div className="search-section">
          <button
            className="back-arrow-btn"
            onClick={goHome}
            style={{
              visibility: isOnHome
                ? 'hidden'
                : 'visible',
            }}
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="header-spacer" />
      </header>

      <div className="app-body">
        <Sidebar />

        <div
          className="page-fade"
          key={location.pathname}
        >
          <Routes>
            <Route
              path="/"
              element={<MainContent />}
            />

            <Route
              path="/album/:id"
              element={<AlbumPage />}
            />

            <Route
              path="/artist/:id"
              element={<ArtistPage />}
            />

            <Route
              path="/playlist/local/:id"
              element={<LocalPlaylistPage />}
            />

            <Route
              path="/playlist/:id"
              element={<PlaylistPage />}
            />

            <Route
              path="/liked"
              element={<LikedSongsPage />}
            />

            <Route
              path="/library"
              element={<LibraryPage />}
            />
          </Routes>
        </div>

        <NowPlayingSidebar />
      </div>

      <GlobalPlayer />

      <MobileBottomNav />
    </div>
  );
}

function GlobalPlayer() {
  const {
    currentSong,
    playNext,
    playPrevious,
    toggleShuffle,
    isShuffled,
    repeatMode,
    toggleRepeat,
    currentIndex,
    queue,
    playerError,
    clearPlayerError,
  } = usePlayer();

  const audioRef = useRef(null);
  const songIdRef = useRef(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;
    const currentSongId = currentSong.id;

    songIdRef.current = currentSongId;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    clearPlayerError();

    const playCurrentSong = async () => {
      try {
        await audio.play();

        if (
          songIdRef.current === currentSongId
        ) {
          setIsPlaying(true);
        }
      } catch (error) {
        if (
          songIdRef.current === currentSongId
        ) {
          console.error(
            'Audio playback failed:',
            error
          );

          setIsPlaying(false);
        }
      }
    };

    playCurrentSong();

    return () => {
      audio.pause();
    };
  }, [
    currentSong,
    clearPlayerError,
  ]);

  if (!currentSong) {
    return null;
  }

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
        clearPlayerError();
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error(
        'Unable to play audio:',
        error
      );

      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (
      Number.isFinite(audio.currentTime)
    ) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (!audio) return;

    const audioDuration = audio.duration;

    setDuration(
      Number.isFinite(audioDuration)
        ? audioDuration
        : 0
    );
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;

    if (!audio) return;

    const newTime =
      Number(e.target.value);

    if (Number.isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;

    const newVolume =
      Number(e.target.value);

    setVolume(newVolume);

    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleEnded = async () => {
    setIsPlaying(false);

    const movedToNext =
      await playNext();

    if (!movedToNext) {
      setIsPlaying(false);
    }
  };

  const handleAudioError = () => {
    console.error(
      'Audio source failed to load.'
    );

    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (
      !Number.isFinite(time) ||
      time < 0
    ) {
      return '0:00';
    }

    const minutes =
      Math.floor(time / 60);

    const seconds =
      Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercentage =
    duration > 0
      ? Math.min(
          100,
          (currentTime / duration) * 100
        )
      : 0;

  const songImage =
    currentSong.image?.[1]?.url ||
    currentSong.image?.[0]?.url ||
    '';

  const songName =
    currentSong.name ||
    currentSong.title ||
    'Unknown song';

  const artistName =
    currentSong.artists?.primary
      ?.map((artist) => artist.name)
      .join(', ') ||
    currentSong.primaryArtists ||
    '';

  const audioUrl =
    currentSong.downloadUrl?.[4]?.url ||
    currentSong.downloadUrl?.[
      currentSong.downloadUrl.length - 1
    ]?.url ||
    currentSong.downloadUrl?.[0]?.url ||
    '';

  const disablePrevious =
    queue.length === 0 ||
    currentIndex < 0 ||
    (
      currentIndex === 0 &&
      repeatMode !== 'all'
    );

  const disableNext =
    queue.length === 0 ||
    currentIndex < 0 ||
    (
      currentIndex >= queue.length - 1 &&
      repeatMode === 'off'
    );

  return (
    <div className="player-bar">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      <div className="player-left">
        <img
          src={songImage}
          alt={songName}
          className="player-thumb"
        />

        <div className="player-song-info">
          <p className="player-song-name">
            {decodeHtml(songName)}
          </p>

          <p className="player-song-artist">
            {decodeHtml(artistName)}
          </p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-buttons">
          <button
            className={`icon-btn ${
              isShuffled
                ? 'active'
                : ''
            }`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            className="icon-btn"
            onClick={playPrevious}
            disabled={disablePrevious}
            title="Previous"
          >
            <SkipBack
              size={20}
              fill="currentColor"
            />
          </button>

          <button
            className="play-btn"
            onClick={togglePlay}
            title={
              isPlaying
                ? 'Pause'
                : 'Play'
            }
          >
            {isPlaying ? (
              <Pause
                size={18}
                fill="black"
              />
            ) : (
              <Play
                size={18}
                fill="black"
              />
            )}
          </button>

          <button
            className="icon-btn"
            onClick={playNext}
            disabled={disableNext}
            title="Next"
          >
            <SkipForward
              size={20}
              fill="currentColor"
            />
          </button>

          <button
            className={`icon-btn ${
              repeatMode !== 'off'
                ? 'active'
                : ''
            }`}
            onClick={toggleRepeat}
            title="Repeat"
          >
            <Repeat size={18} />

            {repeatMode === 'one' && (
              <span className="repeat-one-dot">
                1
              </span>
            )}
          </button>

          <AddToPlaylistButton
            song={currentSong}
            openUpward={true}
          />
        </div>

        <div className="progress-row">
          <span className="time-label">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={handleSeek}
            className="progress-bar"
            style={{
              background: `linear-gradient(
                to right,
                #1db954 ${progressPercentage}%,
                #4d4d4d ${progressPercentage}%
              )`,
            }}
          />

          <span className="time-label">
            {formatTime(duration)}
          </span>
        </div>

        {playerError && (
          <p className="player-error">
            {playerError}
          </p>
        )}
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
          style={{
            background: `linear-gradient(
              to right,
              #1db954 ${volume * 100}%,
              #4d4d4d ${volume * 100}%
            )`,
          }}
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