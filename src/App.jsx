import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  ArrowLeft,
  Home,
  Search,
  Library,
  Heart,
  Mic,
  MicOff,
} from 'lucide-react';

import {
  PlayerProvider,
} from './PlayerContext';

import {
  SearchProvider,
  useSearch,
} from './SearchContext';

import {
  LibraryProvider,
} from './LibraryContext';

import Sidebar from './components/Sidebar';
import NowPlayingSidebar from './components/NowPlayingSidebar';
import GlobalPlayer from './components/GlobalPlayer';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import PlaylistPage from './pages/PlaylistPage';
import LocalPlaylistPage from './pages/LocalPlaylistPage';
import LikedSongsPage from './pages/LikedSongsPage';
import LibraryPage from './pages/LibraryPage';

import './App.css';

const decodeHtml = (text = '') => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

/* =========================================================
   MAIN CONTENT
========================================================= */

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

/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    query,
    updateQuery,
  } = useSearch();

  const goHome = () => {
    updateQuery('');
    navigate('/');
  };

  const goSearch = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const searchInput =
        document.querySelector(
          '.search-bar-input'
        );

      searchInput?.focus();
    }, 100);
  };

  const isHomeActive =
    location.pathname === '/' &&
    !query.trim();

  const isSearchActive =
    location.pathname === '/' &&
    query.trim();

  const isLikedActive =
    location.pathname === '/liked';

  const isLibraryActive =
    location.pathname === '/library';

  const navButtonClass = (active) =>
    `
      flex
      min-w-[58px]
      flex-1
      flex-col
      items-center
      justify-center
      gap-0.5
      rounded-xl
      px-2
      py-1.5
      text-[10px]
      font-medium
      transition-all
      duration-200
      active:scale-95
      ${
        active
          ? 'text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }
    `;

  return (
    <nav
      className="
        fixed
        inset-x-0
        bottom-0
        z-[70]
        flex
        h-[68px]
        items-center
        justify-around
        border-t
        border-white/10
        bg-[#121212]/95
        px-1.5
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-8px_30px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        md:hidden
      "
    >
      {/* HOME */}

      <button
        type="button"
        className={navButtonClass(
          isHomeActive
        )}
        onClick={goHome}
        aria-label="Home"
      >
        <Home
          size={20}
          strokeWidth={
            isHomeActive ? 2.5 : 2
          }
        />

        <span>Home</span>
      </button>

      {/* SEARCH */}

      <button
        type="button"
        className={navButtonClass(
          isSearchActive
        )}
        onClick={goSearch}
        aria-label="Search"
      >
        <Search
          size={20}
          strokeWidth={
            isSearchActive ? 2.5 : 2
          }
        />

        <span>Search</span>
      </button>

      {/* LIKED */}

      <button
        type="button"
        className={`
          ${navButtonClass(isLikedActive)}
          ${
            isLikedActive
              ? 'text-[#1db954]'
              : ''
          }
        `}
        onClick={() => {
          updateQuery('');
          navigate('/liked');
        }}
        aria-label="Liked songs"
      >
        <Heart
          size={20}
          fill={
            isLikedActive
              ? 'currentColor'
              : 'none'
          }
          strokeWidth={
            isLikedActive ? 2.2 : 2
          }
        />

        <span>Liked</span>
      </button>

      {/* LIBRARY */}

      <button
        type="button"
        className={`
          ${navButtonClass(isLibraryActive)}
          ${
            isLibraryActive
              ? 'text-[#1db954]'
              : ''
          }
        `}
        onClick={() => {
          updateQuery('');
          navigate('/library');
        }}
        aria-label="Library"
      >
        <Library
          size={20}
          strokeWidth={
            isLibraryActive ? 2.5 : 2
          }
        />

        <span>Library</span>
      </button>
    </nav>
  );
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  const {
    query,
    updateQuery,
  } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    isNowPlayingSidebarOpen,
    setIsNowPlayingSidebarOpen,
  ] = useState(false);

  const recognitionRef =
    useRef(null);

  const isOnHome =
    location.pathname === '/' &&
    !query.trim();

  /* -------------------------------------------------------
     HOME
  ------------------------------------------------------- */

  const goHome = () => {
    updateQuery('');
    navigate('/');
  };

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     VOICE SEARCH
  ------------------------------------------------------- */

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Voice search is not supported in this browser.'
      );

      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current =
      recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = '';

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      transcript =
        transcript.trim();

      if (transcript) {
        updateQuery(transcript);

        if (
          location.pathname !== '/'
        ) {
          navigate('/');
        }
      }
    };

    recognition.onerror = (event) => {
      console.error(
        'Speech recognition error:',
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  /* -------------------------------------------------------
     CLEANUP VOICE SEARCH
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div
      className="
        min-h-screen
        min-w-0
        overflow-x-hidden
        bg-[#121212]
        text-white
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          flex
          h-16
          items-center
          border-b
          border-white/5
          bg-[#121212]/95
          px-2
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          backdrop-blur-xl
          sm:px-5
        "
      >
        {/* LOGO */}

        <button
          type="button"
          onClick={goHome}
          title="Go to home"
          aria-label="Go to home"
          className="
            hidden
            select-none
            whitespace-nowrap
            rounded-lg
            text-xl
            font-bold
            tracking-tight
            transition-all
            duration-200
            hover:scale-[1.02]
            hover:text-gray-200
            focus:outline-none
            focus:ring-2
            focus:ring-white/20
            sm:block
            md:text-2xl
          "
        >
          <span
            className="
              flex
              items-center
              gap-2
            "
          >
            <img
              src="/sukoon-logo.png"
              alt=""
              aria-hidden="true"
              className="
                h-8
                w-8
                object-contain
                md:h-9
                md:w-9
              "
            />
            <span>Sukoon</span>
          </span>
        </button>

        {/* SEARCH SECTION */}

        <div
          className="
            mx-auto
            flex
            min-w-0
            w-full
            max-w-2xl
            items-center
            gap-1
            sm:absolute
            sm:left-1/2
            sm:top-1/2
            sm:-translate-x-1/2
            sm:-translate-y-1/2
            sm:mx-0
            sm:gap-2
          "
        >
          {/* MOBILE LOGO */}

          <button
            type="button"
            onClick={goHome}
            title="Go to home"
            aria-label="Go to home"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              sm:hidden
              justify-center
              overflow-hidden
              rounded-lg
              transition-all
              duration-200
              hover:bg-white/5
              focus:outline-none
              focus:ring-2
              focus:ring-white/20
              sm:h-10
              sm:w-10
            "
          >
            <img
              src="/sukoon-logo.png"
              alt="Sukoon"
              className="
                h-8
                w-8
                object-contain
                sm:h-9
                sm:w-9
              "
            />
          </button>

          {/* SEARCH BAR */}

          <div
            className="
              flex
              h-10
              min-w-0
              w-full
              items-center
              rounded-full
              border
              border-transparent
              bg-[#242424]
              px-3
              transition-all
              duration-200
              focus-within:border-white/10
              focus-within:bg-[#2b2b2b]
              focus-within:shadow-lg
              focus-within:shadow-black/20
              sm:h-11
              sm:px-4
            "
          >
            <Search
              size={18}
              className="
                mr-2
                shrink-0
                text-gray-400
                sm:mr-3
                sm:size-[19px]
              "
            />

            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={handleSearchChange}
              className="
                search-bar-input
                min-w-0
                flex-1
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-gray-500
              "
            />

            {/* VOICE SEARCH */}

            <button
              type="button"
              onClick={startVoiceSearch}
              title={
                isListening
                  ? 'Stop listening'
                  : 'Search by voice'
              }
              aria-label={
                isListening
                  ? 'Stop voice search'
                  : 'Search by voice'
              }
              className={`
                ml-1
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                transition-all
                duration-200
                focus:outline-none
                sm:ml-2
                ${
                  isListening
                    ? `
                      bg-red-500
                      text-white
                      shadow-lg
                      shadow-red-500/30
                      hover:bg-red-600
                    `
                    : `
                      text-gray-400
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >
              {isListening ? (
                <MicOff size={17} />
              ) : (
                <Mic size={17} />
              )}
            </button>
          </div>
        </div>


      </header>

      {/* ===================================================
          MAIN BODY
      =================================================== */}

      <div
        className="
          flex
          min-h-screen
          w-full
          min-w-0
          pt-16
          pb-[68px]
          md:pb-24
        "
      >
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <div
          className="
            hidden
            h-[calc(100vh-64px)]
            w-[260px]
            shrink-0
            md:flex
            lg:w-[280px]
            xl:w-[300px]
          "
        >
          <Sidebar />
        </div>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main
          key={location.pathname}
          className="
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            transition-opacity
            duration-300
          "
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
              element={
                <LocalPlaylistPage />
              }
            />

            <Route
              path="/playlist/:id"
              element={
                <PlaylistPage />
              }
            />

            <Route
              path="/liked"
              element={
                <LikedSongsPage />
              }
            />

            <Route
              path="/library"
              element={<LibraryPage />}
            />
          </Routes>
        </main>

        {/* =================================================
            NOW PLAYING SIDEBAR
        ================================================= */}

        {isNowPlayingSidebarOpen && (
          <div
            className="
              hidden
              h-[calc(100vh-64px)]
              w-[280px]
              shrink-0
              border-l
              border-white/5
              lg:flex
              xl:w-[320px]
              2xl:w-[340px]
            "
          >
            <NowPlayingSidebar />
          </div>
        )}
      </div>

      {/* ===================================================
          GLOBAL PLAYER
      =================================================== */}

      <GlobalPlayer
        onDesktopArtworkClick={() =>
          setIsNowPlayingSidebarOpen(
            (open) => !open
          )
        }
      />

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      <MobileBottomNav />
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

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