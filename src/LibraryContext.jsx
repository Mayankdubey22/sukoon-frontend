import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

const LibraryContext = createContext();

const STORAGE_KEYS = {
  likedSongs: 'likedSongs',
  playlists: 'playlists',
  likedPlaylists: 'likedPlaylists',
};

const getStoredData = (key, fallback = []) => {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return fallback;
    }

    const parsedData = JSON.parse(savedData);

    return Array.isArray(parsedData)
      ? parsedData
      : fallback;
  } catch (error) {
    console.error(
      `Failed to read ${key} from localStorage:`,
      error
    );

    return fallback;
  }
};

export const useLibrary = () =>
  useContext(LibraryContext);

export const LibraryProvider = ({
  children,
}) => {
  const [likedSongs, setLikedSongs] =
    useState([]);

  const [playlists, setPlaylists] =
    useState([]);

  const [
    likedPlaylists,
    setLikedPlaylists,
  ] = useState([]);

  const [libraryLoaded, setLibraryLoaded] =
    useState(false);

  /*
    Load the library once when the app starts.
  */
  useEffect(() => {
    setLikedSongs(
      getStoredData(
        STORAGE_KEYS.likedSongs
      )
    );

    setPlaylists(
      getStoredData(
        STORAGE_KEYS.playlists
      )
    );

    setLikedPlaylists(
      getStoredData(
        STORAGE_KEYS.likedPlaylists
      )
    );

    setLibraryLoaded(true);
  }, []);

  /*
    Save automatically whenever data changes.

    We wait until the initial library data
    has loaded so we don't accidentally
    overwrite existing localStorage data.
  */
  useEffect(() => {
    if (!libraryLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.likedSongs,
        JSON.stringify(likedSongs)
      );
    } catch (error) {
      console.error(
        'Failed to save liked songs:',
        error
      );
    }
  }, [
    likedSongs,
    libraryLoaded,
  ]);

  useEffect(() => {
    if (!libraryLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.playlists,
        JSON.stringify(playlists)
      );
    } catch (error) {
      console.error(
        'Failed to save playlists:',
        error
      );
    }
  }, [
    playlists,
    libraryLoaded,
  ]);

  useEffect(() => {
    if (!libraryLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEYS.likedPlaylists,
        JSON.stringify(likedPlaylists)
      );
    } catch (error) {
      console.error(
        'Failed to save liked playlists:',
        error
      );
    }
  }, [
    likedPlaylists,
    libraryLoaded,
  ]);

  /*
    SONG LIKES
  */

  const isLiked = (songId) => {
    if (!songId) return false;

    return likedSongs.some(
      (song) =>
        song?.id === songId
    );
  };

  const toggleLike = (song) => {
    if (!song?.id) return;

    setLikedSongs((previousSongs) => {
      const alreadyLiked =
        previousSongs.some(
          (item) =>
            item.id === song.id
        );

      if (alreadyLiked) {
        return previousSongs.filter(
          (item) =>
            item.id !== song.id
        );
      }

      return [
        ...previousSongs,
        song,
      ];
    });
  };

  /*
    PLAYLIST LIKES
  */

  const isPlaylistLiked = (
    playlistId
  ) => {
    if (!playlistId) return false;

    return likedPlaylists.some(
      (playlist) =>
        playlist?.id === playlistId
    );
  };

  const toggleLikePlaylist = (
    playlist
  ) => {
    if (!playlist?.id) return;

    setLikedPlaylists(
      (previousPlaylists) => {
        const alreadyLiked =
          previousPlaylists.some(
            (item) =>
              item.id === playlist.id
          );

        if (alreadyLiked) {
          return previousPlaylists.filter(
            (item) =>
              item.id !== playlist.id
          );
        }

        return [
          ...previousPlaylists,
          {
            id: playlist.id,
            name:
              playlist.name ||
              'Untitled Playlist',
            image:
              playlist.image ||
              null,
          },
        ];
      }
    );
  };

  /*
    LOCAL PLAYLISTS
  */

  const createPlaylist = (
    name,
    songToAdd = null
  ) => {
    const cleanName =
      name?.trim();

    if (!cleanName) {
      return null;
    }

    const newPlaylist = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: cleanName,
      songs:
        songToAdd?.id
          ? [songToAdd]
          : [],
      createdAt:
        new Date().toISOString(),
    };

    setPlaylists(
      (previousPlaylists) => [
        ...previousPlaylists,
        newPlaylist,
      ]
    );

    return newPlaylist;
  };

  const addToPlaylist = (
    playlistId,
    song
  ) => {
    if (!playlistId || !song?.id) {
      return;
    }

    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.map(
          (playlist) => {
            if (
              playlist.id !==
              playlistId
            ) {
              return playlist;
            }

            const songs =
              Array.isArray(
                playlist.songs
              )
                ? playlist.songs
                : [];

            const alreadyExists =
              songs.some(
                (item) =>
                  item.id === song.id
              );

            if (alreadyExists) {
              return playlist;
            }

            return {
              ...playlist,
              songs: [
                ...songs,
                song,
              ],
            };
          }
        )
    );
  };

  const removeFromPlaylist = (
    playlistId,
    songId
  ) => {
    if (!playlistId || !songId) {
      return;
    }

    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.map(
          (playlist) => {
            if (
              playlist.id !==
              playlistId
            ) {
              return playlist;
            }

            const songs =
              Array.isArray(
                playlist.songs
              )
                ? playlist.songs
                : [];

            return {
              ...playlist,
              songs: songs.filter(
                (song) =>
                  song.id !== songId
              ),
            };
          }
        )
    );
  };

  const deletePlaylist = (
    playlistId
  ) => {
    if (!playlistId) return;

    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.filter(
          (playlist) =>
            playlist.id !==
            playlistId
        )
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        likedSongs,
        playlists,
        likedPlaylists,
        libraryLoaded,

        toggleLike,
        isLiked,

        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,

        toggleLikePlaylist,
        isPlaylistLiked,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};