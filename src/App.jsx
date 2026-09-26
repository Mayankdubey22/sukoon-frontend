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
  Navigate,
} from 'react-router-dom';

import {
  Home,
  Search,
  Library,
  Heart,
  Mic,
  MicOff,
  User,
  LogOut,
  ChevronDown,
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

import {
  AuthProvider,
  useAuth,
} from './AuthContext';

import Sidebar from './components/Sidebar';
import GlobalPlayer from './components/GlobalPlayer';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AlbumPage from './pages/AlbumPage';
import ArtistPage from './pages/ArtistPage';
import PlaylistPage from './pages/PlaylistPage';
import LocalPlaylistPage from './pages/LocalPlaylistPage';
import LikedSongsPage from './pages/LikedSongsPage';
import LibraryPage from './pages/LibraryPage';

import AuthPage from './pages/AuthPage';
import VerifyEmail from './pages/VerifyEmail';
import WelcomeModal from './components/WelcomeModal';

import SpecialMessage from './special/SpecialMessage';

import './App.css';


/* =========================================================
   SPECIAL MESSAGE CONFIGURATION
========================================================= */

const specialEmails = (
  import.meta.env.VITE_SPECIAL_EMAILS || ''
)
  .split(',')
  .map((email) =>
    email.trim().toLowerCase()
  )
  .filter(Boolean);

const specialMessageEnabled =
  import.meta.env.VITE_SPECIAL_MESSAGE_ENABLED !==
  'false';


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
   MAIN LAYOUT
========================================================= */

function Layout() {
  const {
    query,
    updateQuery,
  } = useSearch();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [welcomeType, setWelcomeType] =
    useState(null);

  /*
    Special popup state.

    Starts false so normal users never
    briefly see the popup while auth
    information is loading.
  */

  const [
    showSpecialMessage,
    setShowSpecialMessage,
  ] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    showAccountMenu,
    setShowAccountMenu,
  ] = useState(false);

  const recognitionRef =
    useRef(null);


  /* -------------------------------------------------------
     SPECIAL USER CHECK
  ------------------------------------------------------- */

  const isSpecialUser =
    specialMessageEnabled &&
    Boolean(
      user?.email &&
      specialEmails.includes(
        user.email
          .trim()
          .toLowerCase()
      )
    );


  /* -------------------------------------------------------
     SHOW SPECIAL MESSAGE
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isSpecialUser) {
      setShowSpecialMessage(false);
      return;
    }

    /*
      This becomes true whenever the special
      user is authenticated.

      Because this is React state, refreshing
      the website will show it again.
    */

    setShowSpecialMessage(true);
  }, [isSpecialUser]);


  /* -------------------------------------------------------
     WELCOME MODAL
  ------------------------------------------------------- */

  useEffect(() => {
    const savedWelcomeType =
      sessionStorage.getItem(
        'sukoon_welcome_type'
      );

    if (savedWelcomeType) {
      setWelcomeType(
        savedWelcomeType
      );

      sessionStorage.removeItem(
        'sukoon_welcome_type'
      );
    }
  }, []);


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
     LOGOUT
  ------------------------------------------------------- */

  const handleLogout = () => {
    setShowAccountMenu(false);

    /*
      Also close special popup immediately
      when the special user logs out.
    */

    setShowSpecialMessage(false);

    logout();

    navigate('/auth', {
      replace: true,
    });
  };


  /* -------------------------------------------------------
     CLEANUP
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);


  useEffect(() => {
    setShowAccountMenu(false);
  }, [location.pathname]);


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


        {/* SEARCH */}

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
              justify-center
              overflow-hidden
              rounded-lg
              transition-all
              duration-200
              hover:bg-white/5
              focus:outline-none
              focus:ring-2
              focus:ring-white/20
              sm:hidden
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


        {/* ACCOUNT */}

        <div className="relative ml-auto shrink-0">

          {isAuthenticated && user ? (
            <>

              <button
                type="button"
                onClick={() =>
                  setShowAccountMenu(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  ml-2
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-[#242424]
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-red-500/30
                  hover:bg-[#2d2d2d]
                  hover:shadow-[0_0_18px_rgba(229,9,47,0.12)]
                  active:scale-95
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500/20
                  sm:ml-0
                  sm:h-10
                  sm:w-auto
                  sm:gap-2
                  sm:px-2
                  sm:pr-3
                "
                aria-label="Account menu"
                aria-expanded={
                  showAccountMenu
                }
              >

                {/* Profile image / icon */}

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-[#333]
                    text-gray-200
                  "
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={
                        user.name ||
                        'User'
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <User size={17} />
                  )}
                </div>


                {/* Desktop user name */}

                <span
                  className="
                    hidden
                    max-w-[120px]
                    truncate
                    text-sm
                    font-medium
                    sm:block
                  "
                >
                  {user.name ||
                    'Account'}
                </span>


                {/* Desktop chevron */}

                <ChevronDown
                  size={16}
                  className={`
                    hidden
                    text-gray-400
                    transition-transform
                    sm:block
                    ${
                      showAccountMenu
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />

              </button>


              {/* ACCOUNT MENU */}

              {showAccountMenu && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    z-[100]
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#181818]/95
                    shadow-[0_20px_60px_rgba(0,0,0,0.55)]
                    backdrop-blur-xl
                  "
                >

                  {/* User information */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-white/10
                      px-4
                      py-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-[#303030]
                        text-gray-200
                      "
                    >
                      {user.profileImage ? (
                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name ||
                            'User'
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {user.name ||
                          'Sukoon User'}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-gray-500
                        "
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>


                  {/* Liked */}

                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(
                        false
                      );

                      navigate('/liked');
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-gray-300
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                  >
                    <Heart size={17} />

                    Liked Songs
                  </button>


                  {/* Library */}

                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(
                        false
                      );

                      navigate(
                        '/library'
                      );
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-gray-300
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                  >
                    <Library size={17} />

                    Your Library
                  </button>


                  {/* Divider */}

                  <div
                    className="
                      border-t
                      border-white/10
                    "
                  />


                  {/* Logout */}

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      text-red-400
                      transition
                      hover:bg-red-500/10
                    "
                  >
                    <LogOut size={17} />

                    Log out
                  </button>

                </div>
              )}

            </>
          ) : null}

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

        {/* SIDEBAR */}

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


        {/* PAGE CONTENT */}

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
              element={
                <MainContent />
              }
            />

            <Route
              path="/album/:id"
              element={
                <AlbumPage />
              }
            />

            <Route
              path="/artist/:id"
              element={
                <ArtistPage />
              }
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
              element={
                <LibraryPage />
              }
            />

          </Routes>
        </main>

      </div>


      {/* GLOBAL PLAYER */}

      <GlobalPlayer />


      {/* MOBILE NAVIGATION */}

      <MobileBottomNav />


      {/* WELCOME MODAL */}

      {welcomeType && (
        <WelcomeModal
          type={welcomeType}
          userName={
            user?.name || 'there'
          }
          onClose={() =>
            setWelcomeType(null)
          }
        />
      )}


      {/* ===================================================
          SPECIAL MESSAGE
      =================================================== */}

      {isSpecialUser &&
        showSpecialMessage && (
          <SpecialMessage
            userName={
              user?.name || 'Mayank'
            }
            backgroundImage="/special/special-wallpaper.jpeg"
            onComplete={() => {
              console.log(
                'Special message completed'
              );
            }}
            onClose={() => {
              setShowSpecialMessage(
                false
              );
            }}
          />
        )}

    </div>
  );
}


/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const location = useLocation();

  const {
    isAuthenticated,
    loading,
  } = useAuth();


  /* -------------------------------------------------------
     AUTH PAGES
  ------------------------------------------------------- */

  if (
    location.pathname === '/auth' ||
    location.pathname ===
      '/verify-email'
  ) {
    return (
      <Routes>

        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <AuthPage />
            )
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        />

      </Routes>
    );
  }


  /* -------------------------------------------------------
     WAIT FOR AUTH INITIALIZATION
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div
        className="
          fixed
          inset-0
          flex
          items-center
          justify-center
          bg-[#08090c]
          text-white
        "
      >
        <div className="text-center">

          <img
            src="/sukoon-logo.png"
            alt="Sukoon"
            className="
              mx-auto
              mb-4
              h-14
              w-14
              animate-pulse
              object-contain
            "
          />

          <p className="text-sm text-gray-500">
            Loading Sukoon...
          </p>

        </div>
      </div>
    );
  }


  /* -------------------------------------------------------
     NOT AUTHENTICATED
  ------------------------------------------------------- */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
      />
    );
  }


  /* -------------------------------------------------------
     AUTHENTICATED
  ------------------------------------------------------- */

  return <Layout />;
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <SearchProvider>
          <LibraryProvider>
            <AppContent />
          </LibraryProvider>
        </SearchProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;