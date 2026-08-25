import React, { createContext, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config'; // adjust path: use './config' if the file is directly in src/

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);       // list of lightweight song objects
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const originalQueue = useRef([]); // keeps unshuffled order to restore later
  const [sourceName, setSourceName] = useState('');

  const fetchFullSong = async (songId) => {
    const response = await axios.get(`${API_BASE_URL}/api/songs/song/${songId}`);
    return response.data.data[0];
  };

  // Play a single song (not from a playlist/album) -> builds a "radio" queue using suggestions
  const dedupeSongs = (songs) => {
    const seen = new Set();
    return songs.filter((s) => {
      const key = `${(s.name || s.title || '').toLowerCase().trim()}-${(s.primaryArtists || '').toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const playSong = async (song) => {
    try {
      const full = await fetchFullSong(song.id);
      setCurrentSong(full);

      const artistName = full.primaryArtists || full.artists?.primary?.[0]?.name || '';
      const language = full.language || '';

      const radioRes = await axios.get(`${API_BASE_URL}/api/songs/radio`, {
        params: { language, artist: artistName }
      });
      const relatedSongs = radioRes.data.data || [];
      const filteredRelated = relatedSongs.filter(s => s.id !== song.id);

      const newQueue = dedupeSongs([song, ...filteredRelated]);
      originalQueue.current = newQueue;
      setQueue(newQueue);
      setCurrentIndex(0);
      setIsShuffled(false);
      setSourceName('Radio');
    } catch (error) {
      console.error('Failed to play song:', error);
    }
  };

  // Play from a specific list (album/artist/playlist) starting at a given index
  const playQueue = async (songs, startIndex = 0, source = '') => {
    try {
      const deduped = dedupeSongs(songs);
      const targetSong = songs[startIndex];
      const newIndex = deduped.findIndex((s) => s.id === targetSong.id);
      const safeIndex = newIndex >= 0 ? newIndex : 0;

      originalQueue.current = deduped;
      setQueue(deduped);
      setCurrentIndex(safeIndex);
      setIsShuffled(false);
      setSourceName(source);

      const full = await fetchFullSong(deduped[safeIndex].id);
      setCurrentSong(full);
    } catch (error) {
      console.error('Failed to play queue:', error);
    }
  };

  const playNext = async () => {
    if (queue.length === 0) return;

    // Repeat One: replay the same song
    if (repeatMode === 'one') {
      const full = await fetchFullSong(queue[currentIndex].id);
      setCurrentSong(full);
      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0; // loop back to start
      } else {
        return; // end of queue, no repeat
      }
    }

    setCurrentIndex(nextIndex);
    const full = await fetchFullSong(queue[nextIndex].id);
    setCurrentSong(full);
  };

  const playPrevious = async () => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    setCurrentIndex(prevIndex);
    const full = await fetchFullSong(queue[prevIndex].id);
    setCurrentSong(full);
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      // Shuffle everything after the current song
      const played = queue.slice(0, currentIndex + 1);
      const remaining = queue.slice(currentIndex + 1);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      setQueue([...played, ...remaining]);
      setIsShuffled(true);
    } else {
      // Restore original order (keep current song position sensible)
      setQueue(originalQueue.current);
      setIsShuffled(false);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
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
        playSong,
        playQueue,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};