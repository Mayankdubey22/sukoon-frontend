import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  ChevronDown,
  MoreHorizontal,
  Heart,
} from 'lucide-react';

import {
  usePlayer,
} from '../PlayerContext';

import {
  useLibrary,
} from '../LibraryContext';

import AddToPlaylistButton from './AddToPlaylistButton';
import Lyrics from '../lyrics/Lyrics';

const decodeHtml = (text = '') => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};


function GlobalPlayer({
  onDesktopArtworkClick,
}) {
  const {
    currentSong,
    playNext,
    playPrevious,
    playQueue,
    toggleShuffle,
    isShuffled,
    repeatMode,
    toggleRepeat,
    currentIndex,
    queue,
    playerError,
    clearPlayerError,
  } = usePlayer();

  const {
    isLiked,
    toggleLike,
  } = useLibrary();

  const [
    isMobilePlayerOpen,
    setIsMobilePlayerOpen,
  ] = useState(false);

  const [
    mobilePlayerPanel,
    setMobilePlayerPanel,
  ] = useState('lyrics');

  const audioRef =
    useRef(null);

  const songIdRef =
    useRef(null);

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0);

  /* -------------------------------------------------------
     SMOOTH PLAYBACK TIME SYNC

     The browser's timeupdate event is not guaranteed to fire
     often enough for lyric synchronization. Keep the player
     time state synced independently while audio is playing.
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const syncPlaybackTime = () => {
      const audio = audioRef.current;

      if (
        audio &&
        Number.isFinite(audio.currentTime)
      ) {
        setCurrentTime(audio.currentTime);
      }
    };

    syncPlaybackTime();

    const intervalId = window.setInterval(
      syncPlaybackTime,
      100
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying]);

  const [
    duration,
    setDuration,
  ] = useState(0);

  const [
    volume,
    setVolume,
  ] = useState(1);

  const [
    miniSwipeX,
    setMiniSwipeX,
  ] = useState(0);

  const [
    miniSwipeAnimating,
    setMiniSwipeAnimating,
  ] = useState(false);

  const [
    artworkSwipeX,
    setArtworkSwipeX,
  ] = useState(0);

  const [
    artworkSwipeAnimating,
    setArtworkSwipeAnimating,
  ] = useState(false);

  const [
    mobilePlayerDragY,
    setMobilePlayerDragY,
  ] = useState(0);

  const [
    mobilePlayerDragging,
    setMobilePlayerDragging,
  ] = useState(false);

  const miniSwipeRef = useRef({
    startX: 0,
    startY: 0,
    dragging: false,
    swiped: false,
    width: 1,
    currentX: 0,
  });

  const artworkSwipeRef = useRef({
    startX: 0,
    startY: 0,
    dragging: false,
    swiped: false,
    width: 1,
    currentX: 0,
  });

  const playerDragRef = useRef({
    startX: 0,
    startY: 0,
    dragging: false,
    width: 1,
  });

  const miniViewportRef = useRef(null);
  const artworkViewportRef = useRef(null);
  const mobilePlayerContentRef = useRef(null);
  const mobileHistoryPushedRef = useRef(false);

  /* -------------------------------------------------------
     LOCK BODY SCROLL WHEN MOBILE PLAYER IS OPEN
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isMobilePlayerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isMobilePlayerOpen]);

  /* -------------------------------------------------------
     ANDROID / BROWSER BACK BUTTON
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isMobilePlayerOpen) {
      return;
    }

    window.history.pushState(
      { sukoonMobilePlayer: true },
      '',
      window.location.href
    );

    mobileHistoryPushedRef.current = true;

    const handlePopState = () => {
      mobileHistoryPushedRef.current = false;
      setIsMobilePlayerOpen(false);
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, [isMobilePlayerOpen]);

  /* -------------------------------------------------------
     LOAD CURRENT SONG
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      !currentSong ||
      !audioRef.current
    ) {
      return;
    }

    const audio =
      audioRef.current;

    const currentSongId =
      currentSong.id;

    songIdRef.current =
      currentSongId;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    clearPlayerError();

    const playCurrentSong =
      async () => {
        try {
          await audio.play();

          if (
            songIdRef.current ===
            currentSongId
          ) {
            setIsPlaying(true);
          }
        } catch (error) {
          if (
            songIdRef.current ===
            currentSongId
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

  /* -------------------------------------------------------
     PLAY / PAUSE
  ------------------------------------------------------- */

  const togglePlay = async () => {
    const audio =
      audioRef.current;

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

  /* -------------------------------------------------------
     PLAY QUEUE SONG FROM MOBILE QUEUE
  ------------------------------------------------------- */

  const handleQueueSongClick = async (
    song,
    index
  ) => {
    if (!song?.id) {
      return;
    }

    await playQueue(
      queue,
      index
    );
  };

  /* -------------------------------------------------------
     TIME UPDATE
  ------------------------------------------------------- */

  const handleTimeUpdate = () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (
      Number.isFinite(
        audio.currentTime
      )
    ) {
      setCurrentTime(
        audio.currentTime
      );
    }
  };

  /* -------------------------------------------------------
     METADATA
  ------------------------------------------------------- */

  const handleLoadedMetadata = () => {
    const audio =
      audioRef.current;

    if (!audio) return;

    const audioDuration =
      audio.duration;

    setDuration(
      Number.isFinite(
        audioDuration
      )
        ? audioDuration
        : 0
    );
  };

  /* -------------------------------------------------------
     SEEK
  ------------------------------------------------------- */

  const handleSeek = (e) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    const newTime =
      Number(e.target.value);

    if (
      Number.isFinite(newTime)
    ) {
      audio.currentTime =
        newTime;

      setCurrentTime(newTime);
    }
  };

  /* -------------------------------------------------------
     SEEK FROM LYRICS
  ------------------------------------------------------- */

  const handleLyricsSeek = (time) => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(time)) {
      return;
    }

    const safeTime = Math.max(
      0,
      duration > 0
        ? Math.min(time, duration)
        : time
    );

    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  };

  /* -------------------------------------------------------
     VOLUME
  ------------------------------------------------------- */

  const handleVolumeChange = (e) => {
    const audio =
      audioRef.current;

    const newVolume =
      Number(e.target.value);

    setVolume(newVolume);

    if (audio) {
      audio.volume =
        newVolume;
    }
  };

  /* -------------------------------------------------------
     SONG ENDED
  ------------------------------------------------------- */

  const handleEnded = async () => {
    setIsPlaying(false);

    const movedToNext =
      await playNext();

    if (!movedToNext) {
      setIsPlaying(false);
    }
  };

  /* -------------------------------------------------------
     AUDIO ERROR
  ------------------------------------------------------- */

  const handleAudioError = () => {
    console.error(
      'Audio source failed to load.'
    );

    setIsPlaying(false);
  };

  /* -------------------------------------------------------
     FORMAT TIME
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     PROGRESS
  ------------------------------------------------------- */

  const progressPercentage =
    duration > 0
      ? Math.min(
          100,
          (currentTime / duration) *
            100
        )
      : 0;

  /* -------------------------------------------------------
     SONG INFORMATION
  ------------------------------------------------------- */

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
      ?.map(
        (artist) =>
          artist.name
      )
      .join(', ') ||
    currentSong.primaryArtists ||
    '';

  const downloadUrls =
    Array.isArray(
      currentSong.downloadUrl
    )
      ? currentSong.downloadUrl
      : [];

  const audioUrl =
    downloadUrls?.[4]?.url ||
    downloadUrls?.[
      downloadUrls.length - 1
    ]?.url ||
    downloadUrls?.[0]?.url ||
    '';

  const currentSongLiked =
    isLiked(currentSong.id);

  /* -------------------------------------------------------
     QUEUE
  ------------------------------------------------------- */

  const safeQueue =
    Array.isArray(queue)
      ? queue
      : [];

  const queueWithoutCurrent =
    safeQueue.filter(
      (song) =>
        song?.id !== currentSong.id
    );

  /* -------------------------------------------------------
     DISABLED BUTTONS
  ------------------------------------------------------- */

  const disablePrevious =
    safeQueue.length === 0 ||
    currentIndex < 0 ||
    (
      currentIndex === 0 &&
      repeatMode !== 'all'
    );

  const disableNext =
    safeQueue.length === 0 ||
    currentIndex < 0 ||
    (
      currentIndex >=
        safeQueue.length - 1 &&
      repeatMode === 'off'
    );

  /* -------------------------------------------------------
     BUTTON STYLES
  ------------------------------------------------------- */

  const controlButtonClass = `
    relative
    flex
    h-8
    w-8
    shrink-0
    items-center
    justify-center
    rounded-full
    transition-all
    duration-200
    active:scale-90
    focus:outline-none
    focus:ring-2
    focus:ring-white/10
    sm:h-9
    sm:w-9
  `;

  /* -------------------------------------------------------
     MOBILE GESTURES
  ------------------------------------------------------- */

  const closeMobilePlayer = () => {
    if (mobileHistoryPushedRef.current) {
      window.history.back();
      return;
    }

    setIsMobilePlayerOpen(false);
  };

  const getSongImage = (song) =>
    song?.image?.[1]?.url ||
    song?.image?.[0]?.url ||
    '';

  const getSongName = (song) =>
    song?.name ||
    song?.title ||
    'Unknown song';

  const getArtistName = (song) =>
    song?.artists?.primary
      ?.map((artist) => artist.name)
      .join(', ') ||
    song?.primaryArtists ||
    '';

  const getAdjacentSong = (direction) => {
    if (currentIndex < 0 || safeQueue.length === 0) {
      return null;
    }

    const targetIndex =
      currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= safeQueue.length) {
      return null;
    }

    return safeQueue[targetIndex] || null;
  };

  const finishMiniSwipe = async (direction) => {
    const targetSong =
      getAdjacentSong(direction);

    if (!targetSong) {
      setMiniSwipeAnimating(true);
      setMiniSwipeX(0);
      window.setTimeout(() => {
        setMiniSwipeAnimating(false);
      }, 280);
      return;
    }

    const width =
      miniSwipeRef.current.width || 1;

    setMiniSwipeAnimating(true);
    setMiniSwipeX(
      direction < 0 ? -width : width
    );

    window.setTimeout(async () => {
      if (direction < 0) {
        await playNext();
      } else {
        await playPrevious();
      }

      setMiniSwipeAnimating(false);
      setMiniSwipeX(0);
    }, 280);
  };

  const handleMiniTouchStart = (event) => {
    if (!event.touches?.[0]) return;

    const width =
      miniViewportRef.current?.clientWidth || 1;

    miniSwipeRef.current = {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      dragging: true,
      swiped: false,
      width,
      currentX: 0,
    };

    setMiniSwipeAnimating(false);
    setMiniSwipeX(0);
  };

  const handleMiniTouchMove = (event) => {
    const gesture = miniSwipeRef.current;
    if (!gesture.dragging || !event.touches?.[0]) return;

    const dx =
      event.touches[0].clientX - gesture.startX;
    const dy =
      event.touches[0].clientY - gesture.startY;

    if (Math.abs(dy) > Math.abs(dx) * 1.15) {
      gesture.dragging = false;
      setMiniSwipeX(0);
      return;
    }

    if (Math.abs(dx) > 8) {
      gesture.swiped = true;
    }

    const resistance =
      getAdjacentSong(dx < 0 ? -1 : 1) ? 1 : 0.28;

    const nextX = Math.max(
      -gesture.width * 0.92,
      Math.min(gesture.width * 0.92, dx * resistance)
    );

    gesture.currentX = nextX;
    setMiniSwipeX(nextX);
  };

  const handleMiniTouchEnd = async () => {
    const gesture = miniSwipeRef.current;
    if (!gesture.dragging) return;

    gesture.dragging = false;

    const swipeDistance = Math.abs(gesture.currentX);
    const threshold = Math.min(
      Math.max(34, gesture.width * 0.12),
      55
    );

    if (swipeDistance >= threshold) {
      await finishMiniSwipe(
        gesture.currentX < 0 ? -1 : 1
      );
    } else {
      setMiniSwipeAnimating(true);
      setMiniSwipeX(0);
      window.setTimeout(() => {
        setMiniSwipeAnimating(false);
      }, 280);
    }
  };

  const handleMiniClick = (event) => {
    if (miniSwipeRef.current.swiped) {
      miniSwipeRef.current.swiped = false;
      return;
    }

    setIsMobilePlayerOpen(true);
  };

  const finishArtworkSwipe = async (direction) => {
    const targetSong =
      getAdjacentSong(direction);

    if (!targetSong) {
      setArtworkSwipeAnimating(true);
      setArtworkSwipeX(0);
      window.setTimeout(() => {
        setArtworkSwipeAnimating(false);
      }, 320);
      return;
    }

    const width =
      artworkSwipeRef.current.width || 1;

    setArtworkSwipeAnimating(true);
    setArtworkSwipeX(
      direction < 0 ? -width : width
    );

    window.setTimeout(async () => {
      if (direction < 0) {
        await playNext();
      } else {
        await playPrevious();
      }

      setArtworkSwipeAnimating(false);
      setArtworkSwipeX(0);
    }, 320);
  };

  const handleArtworkTouchStart = (event) => {
    if (!event.touches?.[0]) return;

    const width =
      artworkViewportRef.current?.clientWidth || 1;

    artworkSwipeRef.current = {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      dragging: true,
      swiped: false,
      width,
      currentX: 0,
    };

    setArtworkSwipeAnimating(false);
    setArtworkSwipeX(0);
  };

  const handleArtworkTouchMove = (event) => {
    const gesture = artworkSwipeRef.current;
    if (!gesture.dragging || !event.touches?.[0]) return;

    const dx =
      event.touches[0].clientX - gesture.startX;
    const dy =
      event.touches[0].clientY - gesture.startY;

    if (Math.abs(dy) > Math.abs(dx) * 1.1) {
      gesture.dragging = false;
      setArtworkSwipeX(0);
      return;
    }

    if (Math.abs(dx) > 8) {
      gesture.swiped = true;
    }

    const resistance =
      getAdjacentSong(dx < 0 ? -1 : 1) ? 1 : 0.28;

    const nextX = Math.max(
      -gesture.width * 0.95,
      Math.min(gesture.width * 0.95, dx * resistance)
    );

    gesture.currentX = nextX;
    setArtworkSwipeX(nextX);
  };

  const handleArtworkTouchEnd = async () => {
    const gesture = artworkSwipeRef.current;
    if (!gesture.dragging) return;

    gesture.dragging = false;

    const swipeDistance = Math.abs(gesture.currentX);
    const threshold = Math.min(
      Math.max(42, gesture.width * 0.13),
      65
    );

    if (swipeDistance >= threshold) {
      await finishArtworkSwipe(
        gesture.currentX < 0 ? -1 : 1
      );
    } else {
      setArtworkSwipeAnimating(true);
      setArtworkSwipeX(0);
      window.setTimeout(() => {
        setArtworkSwipeAnimating(false);
      }, 320);
    }
  };

  const handlePlayerTouchStart = (event) => {
    if (!event.touches?.[0]) return;

    playerDragRef.current = {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      dragging: true,
      width: window.innerHeight || 1,
    };

    setMobilePlayerDragging(false);
    setMobilePlayerDragY(0);
  };

  const handlePlayerTouchMove = (event) => {
    const gesture = playerDragRef.current;
    if (!gesture.dragging || !event.touches?.[0]) return;

    const dx =
      event.touches[0].clientX - gesture.startX;
    const dy =
      event.touches[0].clientY - gesture.startY;

    if (dy <= 0 || Math.abs(dy) < Math.abs(dx) * 1.15) {
      return;
    }

    const content =
      mobilePlayerContentRef.current;

    if (content && content.scrollTop > 4) {
      gesture.dragging = false;
      return;
    }

    gesture.dragging = true;
    setMobilePlayerDragging(true);

    const resistance = 0.9;
    const maxDrag = gesture.width * 0.96;

    setMobilePlayerDragY(
      Math.min(maxDrag, dy * resistance)
    );
  };

  const handlePlayerTouchEnd = () => {
    const gesture = playerDragRef.current;
    if (!gesture.dragging) return;

    gesture.dragging = false;

    const threshold =
      Math.max(180, gesture.width * 0.5);

    if (mobilePlayerDragY >= threshold) {
      setMobilePlayerDragging(true);
      setMobilePlayerDragY(gesture.width);

      window.setTimeout(() => {
        closeMobilePlayer();
        setMobilePlayerDragging(false);
        setMobilePlayerDragY(0);
      }, 300);
    } else {
      setMobilePlayerDragging(true);
      setMobilePlayerDragY(0);

      window.setTimeout(() => {
        setMobilePlayerDragging(false);
      }, 300);
    }
  };

  /* =======================================================
     PLAYER UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          AUDIO
      =================================================== */}

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={
          handleTimeUpdate
        }
        onLoadedMetadata={
          handleLoadedMetadata
        }
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      {/* ===================================================
          MOBILE MINI PLAYER
      =================================================== */}

      <div
        ref={miniViewportRef}
        className="
          fixed
          inset-x-0
          bottom-[68px]
          z-[65]
          overflow-hidden
          px-2
          md:hidden
          touch-pan-y
        "
        onTouchStart={handleMiniTouchStart}
        onTouchMove={handleMiniTouchMove}
        onTouchEnd={handleMiniTouchEnd}
        onTouchCancel={handleMiniTouchEnd}
      >
        <div
          className="
            flex
            w-[300%]
          "
          style={{
            transform: `translateX(calc(-33.333333% + ${miniSwipeX}px))`,
            transition: miniSwipeAnimating
              ? 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
          }}
        >
          {[
            getAdjacentSong(-1),
            currentSong,
            getAdjacentSong(1),
          ].map((song, cardIndex) => {
            const isCurrent = cardIndex === 1;
            const image = getSongImage(song);
            const name = getSongName(song);
            const artist = getArtistName(song);

            return (
              <div
                key={`${song?.id || 'empty'}-${cardIndex}`}
                className="w-1/3 shrink-0 px-0"
              >
                <div
                  className="
                    flex
                    h-[58px]
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-[#202020]/95
                    px-2
                    shadow-[0_8px_30px_rgba(0,0,0,0.45)]
                    backdrop-blur-xl
                  "
                  onClick={
                    isCurrent
                      ? handleMiniClick
                      : async () => {
                          if (song?.id) {
                            const index = safeQueue.findIndex(
                              (item) => item?.id === song.id
                            );

                            if (index >= 0) {
                              await playQueue(safeQueue, index);
                            }
                          }
                        }
                  }
                >
                  <div
                    className="
                      h-11
                      w-11
                      shrink-0
                      overflow-hidden
                      rounded-md
                      bg-[#282828]
                      shadow-md
                    "
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={decodeHtml(name)}
                        className="h-full w-full object-cover"
                        draggable="false"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-lg"
                      >
                        🎵
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {decodeHtml(name)}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-white/50">
                      {decodeHtml(artist)}
                    </p>
                  </div>

                  {isCurrent && (
                    <>
                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(currentSong);
                        }}
                        aria-label={
                          currentSongLiked
                            ? 'Unlike song'
                            : 'Like song'
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            currentSongLiked
                              ? 'currentColor'
                              : 'none'
                          }
                          className={
                            currentSongLiked
                              ? 'text-[#1db954]'
                              : ''
                          }
                        />
                      </button>

                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md transition active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        aria-label={
                          isPlaying ? 'Pause' : 'Play'
                        }
                      >
                        {isPlaying ? (
                          <Pause size={16} fill="black" />
                        ) : (
                          <Play size={16} fill="black" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================
          MOBILE FULL PLAYER
      =================================================== */}

      {isMobilePlayerOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            flex-col
            overflow-hidden
            bg-[#121212]
            text-white
            md:hidden
            touch-pan-y
          "
          onTouchStart={handlePlayerTouchStart}
          onTouchMove={handlePlayerTouchMove}
          onTouchEnd={handlePlayerTouchEnd}
          onTouchCancel={handlePlayerTouchEnd}
          style={{
            transform: `translateY(${mobilePlayerDragY}px)`,
            transition: mobilePlayerDragging
              ? 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
              : 'none',
            borderRadius: mobilePlayerDragY > 0 ? '0 0 24px 24px' : undefined,
          }}
        >
          {/* TOP BAR */}

          <div
            className="
              flex
              h-16
              shrink-0
              items-center
              justify-between
              px-4
              pt-[env(safe-area-inset-top)]
            "
          >
            <button
              type="button"
              onClick={closeMobilePlayer}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-white/80
                transition
                active:scale-90
                hover:bg-white/10
              "
              aria-label="Close player"
            >
              <ChevronDown size={25} />
            </button>

            <div
              className="
                text-center
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/50
                "
              >
                Now Playing
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  font-medium
                  text-white/80
                "
              >
                Sukoon
              </p>
            </div>

            <button
              type="button"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-white/70
                transition
                active:scale-90
                hover:bg-white/10
              "
              aria-label="More options"
            >
              <MoreHorizontal size={23} />
            </button>
          </div>

          {/* SCROLLABLE PLAYER CONTENT */}

          <div
            ref={mobilePlayerContentRef}
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-5
              pb-10
              touch-pan-y
            "
          >
            {/* ARTWORK */}

            <div
              ref={artworkViewportRef}
              className="
                mx-auto
                mt-4
                aspect-square
                w-full
                max-w-[360px]
                overflow-hidden
                rounded-2xl
                bg-[#282828]
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                sm:mt-8
                touch-pan-y
              "
              onTouchStart={handleArtworkTouchStart}
              onTouchMove={handleArtworkTouchMove}
              onTouchEnd={handleArtworkTouchEnd}
              onTouchCancel={handleArtworkTouchEnd}
            >
              <div
                className="flex h-full w-[300%]"
                style={{
                  transform: `translateX(calc(-33.333333% + ${artworkSwipeX}px))`,
                  transition: artworkSwipeAnimating
                    ? 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                }}
              >
                {[
                  getAdjacentSong(-1),
                  currentSong,
                  getAdjacentSong(1),
                ].map((song, index) => {
                  const image = getSongImage(song);
                  const name = getSongName(song);

                  return (
                    <div
                      key={`${song?.id || 'empty'}-art-${index}`}
                      className="h-full w-1/3 shrink-0"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={decodeHtml(name)}
                          className="h-full w-full select-none object-cover"
                          draggable="false"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-6xl">
                          🎵
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SONG INFORMATION */}

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <h1
                  className="
                    truncate
                    text-xl
                    font-bold
                    tracking-tight
                  "
                >
                  {decodeHtml(
                    songName
                  )}
                </h1>

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-white/55
                  "
                >
                  {decodeHtml(
                    artistName
                  )}
                </p>
              </div>

              {/* LIKE */}

              <button
                type="button"
                onClick={() =>
                  toggleLike(
                    currentSong
                  )
                }
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition
                  active:scale-90
                "
                aria-label={
                  currentSongLiked
                    ? 'Unlike song'
                    : 'Like song'
                }
              >
                <Heart
                  size={23}
                  fill={
                    currentSongLiked
                      ? 'currentColor'
                      : 'none'
                  }
                  className={
                    currentSongLiked
                      ? 'text-[#1db954]'
                      : 'text-white/70'
                  }
                />
              </button>
            </div>

            {/* PROGRESS */}

            <div
              className="
                mt-6
              "
            >
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={handleSeek}
                aria-label="Song progress"
                className="
                  h-1
                  w-full
                  cursor-pointer
                  appearance-none
                  rounded-full
                  bg-[#4d4d4d]
                  accent-[#1db954]
                "
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      #1db954
                      ${progressPercentage}%,
                      #4d4d4d
                      ${progressPercentage}%
                    )
                  `,
                }}
              />

              <div
                className="
                  mt-2
                  flex
                  justify-between
                  text-[10px]
                  tabular-nums
                  text-white/45
                "
              >
                <span>
                  {formatTime(
                    currentTime
                  )}
                </span>

                <span>
                  {formatTime(
                    duration
                  )}
                </span>
              </div>
            </div>

            {/* MAIN CONTROLS */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
              "
            >
              {/* SHUFFLE */}

              <button
                type="button"
                onClick={
                  toggleShuffle
                }
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  transition
                  active:scale-90
                  ${
                    isShuffled
                      ? 'text-[#1db954]'
                      : 'text-white/60'
                  }
                `}
                aria-label="Shuffle"
              >
                <Shuffle size={20} />
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={
                  playPrevious
                }
                disabled={
                  disablePrevious
                }
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  text-white
                  transition
                  active:scale-90
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Previous song"
              >
                <SkipBack
                  size={27}
                  fill="currentColor"
                />
              </button>

              {/* PLAY */}

              <button
                type="button"
                onClick={togglePlay}
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-black
                  shadow-[0_8px_25px_rgba(0,0,0,0.35)]
                  transition
                  active:scale-95
                "
                aria-label={
                  isPlaying
                    ? 'Pause'
                    : 'Play'
                }
              >
                {isPlaying ? (
                  <Pause
                    size={27}
                    fill="black"
                  />
                ) : (
                  <Play
                    size={27}
                    fill="black"
                  />
                )}
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={playNext}
                disabled={
                  disableNext
                }
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  text-white
                  transition
                  active:scale-90
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="Next song"
              >
                <SkipForward
                  size={27}
                  fill="currentColor"
                />
              </button>

              {/* REPEAT */}

              <button
                type="button"
                onClick={
                  toggleRepeat
                }
                className={`
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  transition
                  active:scale-90
                  ${
                    repeatMode !== 'off'
                      ? 'text-[#1db954]'
                      : 'text-white/60'
                  }
                `}
                aria-label="Repeat"
              >
                <Repeat size={20} />

                {repeatMode ===
                  'one' && (
                  <span
                    className="
                      absolute
                      right-1
                      top-0.5
                      text-[9px]
                      font-bold
                    "
                  >
                    1
                  </span>
                )}
              </button>
            </div>

            {/* ADD TO PLAYLIST */}

            <div
              className="
                mt-4
                flex
                justify-center
              "
            >
              <AddToPlaylistButton
                song={currentSong}
                openUpward={false}
              />
            </div>

            {/* =================================================
                LYRICS / QUEUE TOGGLE
            ================================================= */}

            <section
              className="
                mt-8
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
              "
            >
              {/* PANEL TOGGLE */}
              <div
                className="
                  grid
                  grid-cols-2
                  border-b
                  border-white/10
                  bg-white/[0.02]
                  p-1
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setMobilePlayerPanel('lyrics')
                  }
                  className={`
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    active:scale-[0.98]
                    ${
                      mobilePlayerPanel === 'lyrics'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/45 hover:bg-white/[0.05] hover:text-white/80'
                    }
                  `}
                  aria-pressed={
                    mobilePlayerPanel === 'lyrics'
                  }
                >
                  Lyrics
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobilePlayerPanel('queue')
                  }
                  className={`
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    active:scale-[0.98]
                    ${
                      mobilePlayerPanel === 'queue'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/45 hover:bg-white/[0.05] hover:text-white/80'
                    }
                  `}
                  aria-pressed={
                    mobilePlayerPanel === 'queue'
                  }
                >
                  Queue
                </button>
              </div>

              {/* LYRICS PANEL */}
              {mobilePlayerPanel === 'lyrics' && (
                <div>
                  <div
                    className="
                      border-b
                      border-white/10
                      px-4
                      py-3
                    "
                  >
                    <h2 className="text-base font-bold text-white">
                      Lyrics
                    </h2>

                    <p className="mt-0.5 text-xs text-white/40">
                      Synced with the song when available
                    </p>
                  </div>

                  <div className="h-[360px] sm:h-[420px]">
                    <Lyrics
                      song={{
                        ...currentSong,
                        artist: artistName,
                        album:
                          currentSong.album?.name ||
                          currentSong.album ||
                          '',
                      }}
                      currentTime={currentTime}
                      onSeek={handleLyricsSeek}
                    />
                  </div>
                </div>
              )}

              {/* QUEUE PANEL */}
              {mobilePlayerPanel === 'queue' && (
                <div className="px-4 pb-4">
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      py-4
                    "
                  >
                    <div>
                      <h2 className="text-base font-bold">
                        Queue
                      </h2>

                      <p className="mt-0.5 text-xs text-white/40">
                        {queueWithoutCurrent.length}{' '}
                        songs coming up
                      </p>
                    </div>

                    <span className="text-xs font-medium text-white/40">
                      Next up
                    </span>
                  </div>

                  <div className="mt-3 max-h-[360px] overflow-y-auto overscroll-contain pr-1 sm:max-h-[420px]">
                    {safeQueue.length === 0 ? (
                      <div
                        className="
                          rounded-xl
                          bg-white/[0.04]
                          px-4
                          py-6
                          text-center
                          text-sm
                          text-white/40
                        "
                      >
                        Your queue is empty.
                      </div>
                    ) : (
                      safeQueue.map((song, index) => {
                        const image =
                          song.image?.[1]?.url ||
                          song.image?.[0]?.url ||
                          '';

                        const name =
                          song.name ||
                          song.title ||
                          'Unknown song';

                        const artist =
                          song.artists?.primary
                            ?.map((item) => item.name)
                            .join(', ') ||
                          song.primaryArtists ||
                          '';

                        const isCurrent =
                          index === currentIndex;

                        return (
                          <button
                            key={`${song.id}-${index}`}
                            type="button"
                            onClick={() =>
                              handleQueueSongClick(song, index)
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              px-2
                              py-2.5
                              text-left
                              transition
                              active:scale-[0.99]
                              ${
                                isCurrent
                                  ? 'bg-[#1db954]/10'
                                  : 'hover:bg-white/[0.05]'
                              }
                            `}
                          >
                            <div
                              className="
                                flex
                                w-5
                                shrink-0
                                items-center
                                justify-center
                              "
                            >
                              {isCurrent ? (
                                <div className="flex items-end gap-[2px]">
                                  <span className="h-2.5 w-[2px] animate-pulse bg-[#1db954]" />
                                  <span className="h-4 w-[2px] animate-pulse bg-[#1db954]" />
                                  <span className="h-3 w-[2px] animate-pulse bg-[#1db954]" />
                                </div>
                              ) : (
                                <span className="text-xs tabular-nums text-white/30">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <div
                              className="
                                h-12
                                w-12
                                shrink-0
                                overflow-hidden
                                rounded-md
                                bg-[#282828]
                              "
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={decodeHtml(name)}
                                  className="h-full w-full object-cover"
                                  draggable="false"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-lg">
                                  🎵
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`
                                  truncate
                                  text-sm
                                  font-medium
                                  ${
                                    isCurrent
                                      ? 'text-[#1db954]'
                                      : 'text-white'
                                  }
                                `}
                              >
                                {decodeHtml(name)}
                              </p>

                              <p className="mt-1 truncate text-xs text-white/45">
                                {decodeHtml(artist)}
                              </p>
                            </div>

                            <MoreHorizontal
                              size={18}
                              className="shrink-0 text-white/25"
                            />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* PLAYER ERROR */}

            {playerError && (
              <p
                className="
                  mt-4
                  text-center
                  text-xs
                  text-red-400
                "
              >
                {playerError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          DESKTOP GLOBAL PLAYER
          KEEPING EXISTING DESKTOP UI
      =================================================== */}

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-[50]
          hidden
          border-t
          border-white/10
          bg-[#181818]/95
          px-5
          py-3
          text-white
          shadow-[0_-10px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
          md:block
          md:h-24
        "
      >
        <div
          className="
            grid
            h-full
            grid-cols-[minmax(180px,1fr)_minmax(300px,2fr)_minmax(140px,1fr)]
            items-center
            gap-5
          "
        >
          {/* =================================================
              LEFT - SONG INFO
          ================================================= */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            {songImage ? (
              <button
                type="button"
                onClick={onDesktopArtworkClick}
                className="
                  group
                  relative
                  h-14
                  w-14
                  shrink-0
                  overflow-hidden
                  rounded-md
                  shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white/20
                "
                aria-label="Toggle now playing panel"
                title="Show queue and song details"
              >
                <img
                  src={songImage}
                  alt={decodeHtml(
                    songName
                  )}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-200
                    group-hover:scale-105
                  "
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onDesktopArtworkClick}
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  bg-[#282828]
                  text-xl
                  transition
                  hover:bg-[#333333]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white/20
                "
                aria-label="Toggle now playing panel"
                title="Show queue and song details"
              >
                🎵
              </button>
            )}

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-medium
                  text-white
                "
              >
                {decodeHtml(
                  songName
                )}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  text-gray-400
                "
              >
                {decodeHtml(
                  artistName
                )}
              </p>
            </div>
          </div>

          {/* =================================================
              CENTER - CONTROLS
          ================================================= */}

          <div
            className="
              flex
              min-w-0
              flex-col
              items-center
              gap-1
            "
          >
            {/* CONTROLS */}

            <div
              className="
                flex
                max-w-full
                items-center
                justify-center
                gap-2
              "
            >
              {/* SHUFFLE */}

              <button
                type="button"
                className={`
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-200
                  active:scale-90
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white/10
                  ${
                    isShuffled
                      ? 'text-[#1db954]'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={
                  toggleShuffle
                }
                title="Shuffle"
                aria-label="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-300
                  transition-all
                  duration-200
                  active:scale-90
                  hover:bg-white/10
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                onClick={
                  playPrevious
                }
                disabled={
                  disablePrevious
                }
                title="Previous"
                aria-label="Previous song"
              >
                <SkipBack
                  size={20}
                  fill="currentColor"
                />
              </button>

              {/* PLAY / PAUSE */}

              <button
                type="button"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-black
                  shadow-lg
                  shadow-black/30
                  transition-all
                  duration-200
                  hover:scale-105
                  active:scale-95
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white/30
                "
                onClick={
                  togglePlay
                }
                title={
                  isPlaying
                    ? 'Pause'
                    : 'Play'
                }
                aria-label={
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

              {/* NEXT */}

              <button
                type="button"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-300
                  transition-all
                  duration-200
                  active:scale-90
                  hover:bg-white/10
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                onClick={playNext}
                disabled={
                  disableNext
                }
                title="Next"
                aria-label="Next song"
              >
                <SkipForward
                  size={20}
                  fill="currentColor"
                />
              </button>

              {/* REPEAT */}

              <button
                type="button"
                className={`
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-200
                  active:scale-90
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white/10
                  ${
                    repeatMode !== 'off'
                      ? 'text-[#1db954]'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
                onClick={
                  toggleRepeat
                }
                title="Repeat"
                aria-label="Repeat"
              >
                <Repeat size={18} />

                {repeatMode ===
                  'one' && (
                  <span
                    className="
                      absolute
                      right-1
                      top-0
                      text-[9px]
                      font-bold
                    "
                  >
                    1
                  </span>
                )}
              </button>

              {/* ADD TO PLAYLIST */}

              <AddToPlaylistButton
                song={currentSong}
                openUpward={true}
              />
            </div>

            {/* PROGRESS */}

            <div
              className="
                flex
                w-full
                max-w-2xl
                items-center
                gap-2
              "
            >
              <span
                className="
                  w-9
                  shrink-0
                  text-right
                  text-xs
                  tabular-nums
                  text-gray-400
                "
              >
                {formatTime(
                  currentTime
                )}
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
                aria-label="Song progress"
                className="
                  h-1
                  min-w-0
                  flex-1
                  cursor-pointer
                  appearance-none
                  rounded-full
                  bg-[#4d4d4d]
                  accent-[#1db954]
                  transition
                  hover:h-1.5
                "
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      #1db954
                      ${progressPercentage}%,
                      #4d4d4d
                      ${progressPercentage}%
                    )
                  `,
                }}
              />

              <span
                className="
                  w-9
                  shrink-0
                  text-xs
                  tabular-nums
                  text-gray-400
                "
              >
                {formatTime(
                  duration
                )}
              </span>
            </div>

            {/* PLAYER ERROR */}

            {playerError && (
              <p
                className="
                  absolute
                  bottom-1
                  left-1/2
                  max-w-[40%]
                  -translate-x-1/2
                  truncate
                  text-xs
                  text-red-400
                "
              >
                {playerError}
              </p>
            )}
          </div>

          {/* =================================================
              RIGHT - VOLUME
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-2
            "
          >
            <Volume2
              size={18}
              className="text-gray-400"
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={
                handleVolumeChange
              }
              aria-label="Volume"
              className="
                h-1
                w-24
                cursor-pointer
                appearance-none
                rounded-full
                bg-[#4d4d4d]
                accent-[#1db954]
                hover:h-1.5
              "
              style={{
                background: `
                  linear-gradient(
                    to right,
                    #1db954
                    ${volume * 100}%,
                    #4d4d4d
                    ${volume * 100}%
                  )
                `,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalPlayer;
