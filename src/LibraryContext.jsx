import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';

import { API_BASE_URL } from './config';

const LibraryContext =
  createContext();

export const useLibrary = () =>
  useContext(LibraryContext);


/*
=========================================================
HELPER
=========================================================
*/

const getToken = () => {
  return localStorage.getItem(
    'sukoon_token'
  );
};


/*
=========================================================
PROVIDER
=========================================================
*/

export const LibraryProvider = ({
  children,
}) => {
  const [
    likedSongs,
    setLikedSongs,
  ] = useState([]);

  const [
    playlists,
    setPlaylists,
  ] = useState([]);

  const [
    likedPlaylists,
    setLikedPlaylists,
  ] = useState([]);

  const [
    libraryLoaded,
    setLibraryLoaded,
  ] = useState(false);


  /*
  =======================================================
  LOAD LIBRARY FROM DATABASE
  =======================================================
  */

  const loadLibrary = useCallback(
    async () => {
      const token =
        getToken();

      if (!token) {
        setLikedSongs([]);
        setPlaylists([]);
        setLikedPlaylists([]);
        setLibraryLoaded(true);

        return;
      }

      try {
        setLibraryLoaded(false);

        const response =
          await fetch(
            `${API_BASE_URL}/api/library`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status === 401
        ) {
          setLikedSongs([]);
          setPlaylists([]);
          setLikedPlaylists([]);

          return;
        }

        if (!data.success) {
          throw new Error(
            data.message ||
              'Failed to load library.'
          );
        }

        setLikedSongs(
          data.library
            ?.likedSongs || []
        );

        setPlaylists(
          data.library
            ?.playlists || []
        );

        setLikedPlaylists(
          data.library
            ?.likedPlaylists || []
        );
      } catch (error) {
        console.error(
          'Failed to load library:',
          error
        );

        setLikedSongs([]);
        setPlaylists([]);
        setLikedPlaylists([]);
      } finally {
        setLibraryLoaded(true);
      }
    },
    []
  );


  /*
  =======================================================
  LOAD WHEN APP STARTS / USER AUTH CHANGES
  =======================================================
  */

  useEffect(() => {
    loadLibrary();

    const handleAuthChange =
      () => {
        loadLibrary();
      };

    window.addEventListener(
      'sukoon-auth-changed',
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        'sukoon-auth-changed',
        handleAuthChange
      );
    };
  }, [loadLibrary]);


  /*
  =======================================================
  SONG LIKES
  =======================================================
  */

  const isLiked = (
    songId
  ) => {
    if (!songId) {
      return false;
    }

    return likedSongs.some(
      (song) =>
        String(song?.id) ===
        String(songId)
    );
  };


  const toggleLike = async (
    song
  ) => {
    if (!song?.id) {
      return;
    }

    const token =
      getToken();

    if (!token) {
      console.warn(
        'User must be logged in to like a song.'
      );

      return;
    }

    const alreadyLiked =
      isLiked(song.id);

    try {
      if (alreadyLiked) {
        const response =
          await fetch(
            `${API_BASE_URL}/api/library/likes/${encodeURIComponent(
              song.id
            )}`,
            {
              method: 'DELETE',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to unlike song.'
          );
        }

        setLikedSongs(
          (previousSongs) =>
            previousSongs.filter(
              (item) =>
                String(item?.id) !==
                String(song.id)
            )
        );

        return;
      }


      const response =
        await fetch(
          `${API_BASE_URL}/api/library/likes`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              song,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to like song.'
        );
      }

      setLikedSongs(
        (previousSongs) => [
          ...previousSongs,
          data.song || song,
        ]
      );
    } catch (error) {
      console.error(
        'Toggle like error:',
        error
      );
    }
  };


  /*
  =======================================================
  PLAYLIST LIKES
  =======================================================
  */

  const isPlaylistLiked = (
    playlistId
  ) => {
    if (!playlistId) {
      return false;
    }

    return likedPlaylists.some(
      (playlist) =>
        String(playlist?.id) ===
        String(playlistId)
    );
  };


  const toggleLikePlaylist =
    async (playlist) => {
      if (!playlist?.id) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      const alreadyLiked =
        isPlaylistLiked(
          playlist.id
        );

      try {
        if (alreadyLiked) {
          const response =
            await fetch(
              `${API_BASE_URL}/api/library/liked-playlists/${encodeURIComponent(
                playlist.id
              )}`,
              {
                method: 'DELETE',

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                'Failed to unlike playlist.'
            );
          }

          setLikedPlaylists(
            (previous) =>
              previous.filter(
                (item) =>
                  String(item?.id) !==
                  String(playlist.id)
              )
          );

          return;
        }


        const response =
          await fetch(
            `${API_BASE_URL}/api/library/liked-playlists`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                playlist,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to like playlist.'
          );
        }

        setLikedPlaylists(
          (previous) => [
            ...previous,
            {
              id: playlist.id,
              name:
                playlist.name ||
                'Untitled Playlist',
              image:
                playlist.image ||
                null,
            },
          ]
        );
      } catch (error) {
        console.error(
          'Toggle playlist like error:',
          error
        );
      }
    };


  /*
  =======================================================
  CREATE PLAYLIST
  =======================================================
  */

  const createPlaylist =
    async (
      name,
      songToAdd = null
    ) => {
      const cleanName =
        name?.trim();

      if (!cleanName) {
        return null;
      }

      const token =
        getToken();

      if (!token) {
        return null;
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/library/playlists`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                name: cleanName,
                songToAdd:
                  songToAdd?.id
                    ? songToAdd
                    : null,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to create playlist.'
          );
        }

        const newPlaylist =
          data.playlist;

        setPlaylists(
          (previous) => [
            ...previous,
            newPlaylist,
          ]
        );

        return newPlaylist;
      } catch (error) {
        console.error(
          'Create playlist error:',
          error
        );

        return null;
      }
    };


  /*
  =======================================================
  ADD SONG TO PLAYLIST
  =======================================================
  */

  const addToPlaylist =
    async (
      playlistId,
      song
    ) => {
      if (
        !playlistId ||
        !song?.id
      ) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/library/playlists/${encodeURIComponent(
              playlistId
            )}/songs`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                song,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to add song to playlist.'
          );
        }

        setPlaylists(
          (previous) =>
            previous.map(
              (playlist) =>
                String(
                  playlist.id
                ) ===
                String(playlistId)
                  ? data.playlist
                  : playlist
            )
        );
      } catch (error) {
        console.error(
          'Add to playlist error:',
          error
        );
      }
    };


  /*
  =======================================================
  REMOVE SONG FROM PLAYLIST
  =======================================================
  */

  const removeFromPlaylist =
    async (
      playlistId,
      songId
    ) => {
      if (
        !playlistId ||
        !songId
      ) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/library/playlists/${encodeURIComponent(
              playlistId
            )}/songs/${encodeURIComponent(
              songId
            )}`,
            {
              method: 'DELETE',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to remove song.'
          );
        }

        setPlaylists(
          (previous) =>
            previous.map(
              (playlist) =>
                String(
                  playlist.id
                ) ===
                String(playlistId)
                  ? data.playlist
                  : playlist
            )
        );
      } catch (error) {
        console.error(
          'Remove from playlist error:',
          error
        );
      }
    };


  /*
  =======================================================
  DELETE PLAYLIST
  =======================================================
  */

  const deletePlaylist =
    async (playlistId) => {
      if (!playlistId) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/library/playlists/${encodeURIComponent(
              playlistId
            )}`,
            {
              method: 'DELETE',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to delete playlist.'
          );
        }

        setPlaylists(
          (previous) =>
            previous.filter(
              (playlist) =>
                String(
                  playlist.id
                ) !==
                String(playlistId)
            )
        );
      } catch (error) {
        console.error(
          'Delete playlist error:',
          error
        );
      }
    };


  /*
  =======================================================
  REFRESH LIBRARY
  =======================================================
  */

  const refreshLibrary =
    async () => {
      await loadLibrary();
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

        refreshLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};