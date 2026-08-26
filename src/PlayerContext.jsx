import React, {
  createContext,
  useState,
  useContext,
  useRef,
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off | all | one
  const [sourceName, setSourceName] = useState('');
  const [playerError, setPlayerError] = useState(null);

  // Always keeps the original/unshuffled queue.
  const originalQueue = useRef([]);

  const fetchFullSong = async (songId) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/songs/song/${songId}`
    );

    const song = response.data?.data?.[0];

    if (!song) {
      throw new Error('Song information was not found.');
    }

    return song;
  };

  const dedupeSongs = (songs = []) => {
    const seen = new Set();

    return songs.filter((song) => {
      if (!song?.id) return false;

      const key = `${(
        song.name ||
        song.title ||
        ''
      )
        .toLowerCase()
        .trim()}-${(
        song.primaryArtists ||
        song.artists?.primary?.[0]?.name ||
        ''
      )
        .toLowerCase()
        .trim()}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  };

  const playSong = async (song) => {
    if (!song?.id) {
      setPlayerError('This song cannot be played.');
      return;
    }

    setPlayerError(null);

    try {
      const full = await fetchFullSong(song.id);

      setCurrentSong(full);

      const artistName =
        full.primaryArtists ||
        full.artists?.primary?.[0]?.name ||
        '';

      const language = full.language || '';

      let relatedSongs = [];

      try {
        const radioRes = await axios.get(
          `${API_BASE_URL}/api/songs/radio`,
          {
            params: {
              language,
              artist: artistName,
            },
          }
        );

        relatedSongs = radioRes.data?.data || [];
      } catch (radioError) {
        // Playing the requested song should still work
        // even if the radio API fails.
        console.error(
          'Failed to load radio suggestions:',
          radioError
        );
      }

      const filteredRelated = relatedSongs.filter(
        (relatedSong) => relatedSong.id !== song.id
      );

      const newQueue = dedupeSongs([
        full,
        ...filteredRelated,
      ]);

      originalQueue.current = [...newQueue];

      setQueue(newQueue);

      const newCurrentIndex = newQueue.findIndex(
        (item) => item.id === full.id
      );

      setCurrentIndex(
        newCurrentIndex >= 0 ? newCurrentIndex : 0
      );

      setIsShuffled(false);
      setSourceName('Radio');
    } catch (error) {
      console.error('Failed to play song:', error);

      setPlayerError(
        'Unable to play this song. Please try again.'
      );
    }
  };

  const playQueue = async (
    songs,
    startIndex = 0,
    source = ''
  ) => {
    if (!Array.isArray(songs) || songs.length === 0) {
      setPlayerError('There are no songs to play.');
      return;
    }

    setPlayerError(null);

    try {
      const deduped = dedupeSongs(songs);

      if (deduped.length === 0) {
        setPlayerError('There are no playable songs.');
        return;
      }

      const targetSong = songs[startIndex];

      const newIndex = targetSong
        ? deduped.findIndex(
            (song) => song.id === targetSong.id
          )
        : 0;

      const safeIndex =
        newIndex >= 0 ? newIndex : 0;

      originalQueue.current = [...deduped];

      setQueue(deduped);
      setCurrentIndex(safeIndex);
      setIsShuffled(false);
      setSourceName(source);
      setPlayerError(null);

      const full = await fetchFullSong(
        deduped[safeIndex].id
      );

      setCurrentSong(full);
    } catch (error) {
      console.error('Failed to play queue:', error);

      setPlayerError(
        'Unable to play this song. Please try again.'
      );
    }
  };

  const playNext = async () => {
    if (queue.length === 0 || currentIndex < 0) {
      return false;
    }

    setPlayerError(null);

    // Repeat current song.
    if (repeatMode === 'one') {
      try {
        const full = await fetchFullSong(
          queue[currentIndex].id
        );

        setCurrentSong(full);
        return true;
      } catch (error) {
        console.error(
          'Failed to repeat song:',
          error
        );

        setPlayerError(
          'Unable to replay this song.'
        );

        return false;
      }
    }

    let nextIndex = currentIndex + 1;

    // End of queue.
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // No repeat: queue has finished.
        return false;
      }
    }

    try {
      const full = await fetchFullSong(
        queue[nextIndex].id
      );

      setCurrentIndex(nextIndex);
      setCurrentSong(full);

      return true;
    } catch (error) {
      console.error(
        'Failed to play next song:',
        error
      );

      setPlayerError(
        'Unable to play the next song.'
      );

      return false;
    }
  };

  const playPrevious = async () => {
    if (queue.length === 0 || currentIndex <= 0) {
      return false;
    }

    setPlayerError(null);

    const prevIndex = currentIndex - 1;

    try {
      const full = await fetchFullSong(
        queue[prevIndex].id
      );

      setCurrentIndex(prevIndex);
      setCurrentSong(full);

      return true;
    } catch (error) {
      console.error(
        'Failed to play previous song:',
        error
      );

      setPlayerError(
        'Unable to play the previous song.'
      );

      return false;
    }
  };

  const toggleShuffle = () => {
    if (queue.length <= 1) {
      return;
    }

    setPlayerError(null);

    if (!isShuffled) {
      // Keep everything before and including
      // the current song in its existing order.
      const played = queue.slice(
        0,
        currentIndex + 1
      );

      const remaining = queue.slice(
        currentIndex + 1
      );

      // Fisher-Yates shuffle.
      for (
        let i = remaining.length - 1;
        i > 0;
        i--
      ) {
        const j = Math.floor(
          Math.random() * (i + 1)
        );

        [remaining[i], remaining[j]] = [
          remaining[j],
          remaining[i],
        ];
      }

      setQueue([
        ...played,
        ...remaining,
      ]);

      setIsShuffled(true);
    } else {
      // Restore the original order.
      const restoredQueue = [
        ...originalQueue.current,
      ];

      setQueue(restoredQueue);

      // Find the current song in the original queue
      // so currentIndex stays correct.
      const currentSongId = currentSong?.id;

      const restoredIndex =
        restoredQueue.findIndex(
          (song) => song.id === currentSongId
        );

      setCurrentIndex(
        restoredIndex >= 0
          ? restoredIndex
          : 0
      );

      setIsShuffled(false);
    }
  };

  const toggleRepeat = () => {
    setPlayerError(null);

    setRepeatMode((previousMode) => {
      if (previousMode === 'off') {
        return 'all';
      }

      if (previousMode === 'all') {
        return 'one';
      }

      return 'off';
    });
  };

  const clearPlayerError = () => {
    setPlayerError(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        isShuffled,
        repeatMode,
        sourceName,
        playerError,
        playSong,
        playQueue,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        clearPlayerError,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};