import React, {
  createContext,
  useState,
  useContext,
  useRef,
} from 'react';

import axios from 'axios';
import { API_BASE_URL } from './config';

const PlayerContext = createContext();

export const usePlayer = () =>
  useContext(PlayerContext);

export const PlayerProvider = ({
  children,
}) => {
  const [currentSong, setCurrentSong] =
    useState(null);

  const [queue, setQueue] = useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [isShuffled, setIsShuffled] =
    useState(false);

  // off | all | one
  const [repeatMode, setRepeatMode] =
    useState('off');

  const [sourceName, setSourceName] =
    useState('');

  const [playerError, setPlayerError] =
    useState(null);

  // Keeps the original queue before shuffle.
  const originalQueue = useRef([]);

  const fetchFullSong = async (songId) => {
    if (!songId) {
      throw new Error('Invalid song ID.');
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/songs/song/${songId}`
    );

    const song =
      response.data?.data?.[0];

    if (!song) {
      throw new Error(
        'Song information was not found.'
      );
    }

    return song;
  };

  const dedupeSongs = (songs = []) => {
    const seenIds = new Set();

    return songs.filter((song) => {
      if (!song?.id) {
        return false;
      }

      if (seenIds.has(song.id)) {
        return false;
      }

      seenIds.add(song.id);

      return true;
    });
  };

  const playSong = async (song) => {
    if (!song?.id) {
      setPlayerError(
        'This song cannot be played.'
      );

      return false;
    }

    setPlayerError(null);

    try {
      const fullSong =
        await fetchFullSong(song.id);

      setCurrentSong(fullSong);

      const artistName =
        fullSong.primaryArtists ||
        fullSong.artists?.primary
          ?.map((artist) => artist.name)
          .join(', ') ||
        '';

      const language =
        fullSong.language || '';

      let relatedSongs = [];

      try {
        const radioResponse =
          await axios.get(
            `${API_BASE_URL}/api/songs/radio`,
            {
              params: {
                language,
                artist: artistName,
              },
            }
          );

        relatedSongs =
          radioResponse.data?.data || [];
      } catch (radioError) {
        console.error(
          'Failed to load radio suggestions:',
          radioError
        );
      }

      const filteredRelated =
        relatedSongs.filter(
          (relatedSong) =>
            relatedSong?.id !== fullSong.id
        );

      const newQueue = dedupeSongs([
        fullSong,
        ...filteredRelated,
      ]);

      originalQueue.current = [
        ...newQueue,
      ];

      setQueue(newQueue);

      const newIndex =
        newQueue.findIndex(
          (item) =>
            item.id === fullSong.id
        );

      setCurrentIndex(
        newIndex >= 0
          ? newIndex
          : 0
      );

      setIsShuffled(false);

      setSourceName('Radio');

      return true;
    } catch (error) {
      console.error(
        'Failed to play song:',
        error
      );

      setPlayerError(
        'Unable to play this song. Please try again.'
      );

      return false;
    }
  };

  const playQueue = async (
    songs,
    startIndex = 0,
    source = ''
  ) => {
    if (
      !Array.isArray(songs) ||
      songs.length === 0
    ) {
      setPlayerError(
        'There are no songs to play.'
      );

      return false;
    }

    setPlayerError(null);

    try {
      const dedupedSongs =
        dedupeSongs(songs);

      if (dedupedSongs.length === 0) {
        setPlayerError(
          'There are no playable songs.'
        );

        return false;
      }

      const targetSong =
        songs[startIndex];

      let safeIndex = 0;

      if (targetSong?.id) {
        const foundIndex =
          dedupedSongs.findIndex(
            (song) =>
              song.id === targetSong.id
          );

        if (foundIndex >= 0) {
          safeIndex = foundIndex;
        }
      }

      originalQueue.current = [
        ...dedupedSongs,
      ];

      setQueue(dedupedSongs);

      setCurrentIndex(safeIndex);

      setIsShuffled(false);

      setSourceName(source);

      const fullSong =
        await fetchFullSong(
          dedupedSongs[safeIndex].id
        );

      setCurrentSong(fullSong);

      return true;
    } catch (error) {
      console.error(
        'Failed to play queue:',
        error
      );

      setPlayerError(
        'Unable to play this song. Please try again.'
      );

      return false;
    }
  };

  const playNext = async () => {
    if (
      queue.length === 0 ||
      currentIndex < 0
    ) {
      return false;
    }

    setPlayerError(null);

    // Repeat one means restart the same song.
    if (repeatMode === 'one') {
      try {
        const fullSong =
          await fetchFullSong(
            queue[currentIndex].id
          );

        setCurrentSong(fullSong);

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

    let nextIndex =
      currentIndex + 1;

    // Reached the end of queue.
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return false;
      }
    }

    try {
      const fullSong =
        await fetchFullSong(
          queue[nextIndex].id
        );

      setCurrentIndex(nextIndex);

      setCurrentSong(fullSong);

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
    if (
      queue.length === 0 ||
      currentIndex < 0
    ) {
      return false;
    }

    setPlayerError(null);

    let previousIndex =
      currentIndex - 1;

    // If on the first song and repeat all
    // is enabled, go to the last song.
    if (previousIndex < 0) {
      if (repeatMode === 'all') {
        previousIndex =
          queue.length - 1;
      } else {
        return false;
      }
    }

    try {
      const fullSong =
        await fetchFullSong(
          queue[previousIndex].id
        );

      setCurrentIndex(previousIndex);

      setCurrentSong(fullSong);

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

  const shuffleArray = (array) => {
    const shuffled = [...array];

    for (
      let i = shuffled.length - 1;
      i > 0;
      i--
    ) {
      const randomIndex =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        shuffled[i],
        shuffled[randomIndex],
      ] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    }

    return shuffled;
  };

  const toggleShuffle = () => {
    if (queue.length <= 1) {
      return;
    }

    setPlayerError(null);

    if (!isShuffled) {
      const currentSongId =
        currentSong?.id;

      // Keep the currently playing song first.
      const remainingSongs =
        queue.filter(
          (song) =>
            song.id !== currentSongId
        );

      const shuffledRemaining =
        shuffleArray(remainingSongs);

      const newQueue = currentSong
        ? [
            currentSong,
            ...shuffledRemaining,
          ]
        : shuffleArray(queue);

      setQueue(newQueue);

      setCurrentIndex(0);

      setIsShuffled(true);

      return;
    }

    // Restore original order.
    const restoredQueue = [
      ...originalQueue.current,
    ];

    if (restoredQueue.length === 0) {
      return;
    }

    const currentSongId =
      currentSong?.id;

    const restoredIndex =
      restoredQueue.findIndex(
        (song) =>
          song.id === currentSongId
      );

    setQueue(restoredQueue);

    setCurrentIndex(
      restoredIndex >= 0
        ? restoredIndex
        : 0
    );

    setIsShuffled(false);
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