import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Plus,
  Check,
  Heart,
  X,
} from 'lucide-react';
import { useLibrary } from '../LibraryContext';

function AddToPlaylistButton({
  song,
  openUpward = false,
}) {
  const {
    playlists,
    addToPlaylist,
    createPlaylist,
    toggleLike,
    isLiked,
    libraryLoaded,
  } = useLibrary();

  const [open, setOpen] = useState(false);
  const [newName, setNewName] =
    useState('');

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const songId = song?.id;

  const liked = songId
    ? isLiked(songId)
    : false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleLike = (event) => {
    event.stopPropagation();

    if (!songId) return;

    toggleLike(song);
  };

  const handleToggleMenu = (event) => {
    event.stopPropagation();

    if (!songId || !libraryLoaded) return;

    setOpen((previous) => !previous);
  };

  const isSongInPlaylist = (playlist) => {
    return playlist.songs?.some(
      (item) => item.id === songId
    );
  };

  const handleAdd = (
    event,
    playlistId
  ) => {
    event.stopPropagation();

    if (!songId) return;

    addToPlaylist(
      playlistId,
      song
    );

    // Keep the menu open so the user can
    // add the song to multiple playlists.
  };

  const handleCreateAndAdd = (event) => {
    event.stopPropagation();

    const playlistName =
      newName.trim();

    if (!playlistName || !songId) {
      return;
    }

    createPlaylist(
      playlistName,
      song
    );

    setNewName('');
    setOpen(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      handleCreateAndAdd(event);
    }

    if (event.key === 'Escape') {
      setOpen(false);
      setNewName('');
    }
  };

  if (!songId) {
    return null;
  }

  return (
    <div
      className="add-to-playlist-wrapper"
      ref={menuRef}
    >
      {/* LIKE BUTTON */}

      <button
        className={`icon-btn like-btn ${
          liked ? 'active' : ''
        }`}
        onClick={handleLike}
        title={
          liked
            ? 'Remove from liked songs'
            : 'Add to liked songs'
        }
        aria-label={
          liked
            ? 'Remove from liked songs'
            : 'Add to liked songs'
        }
      >
        <Heart
          size={18}
          fill={
            liked
              ? '#1db954'
              : 'none'
          }
        />
      </button>

      {/* PLAYLIST MENU BUTTON */}

      <button
        className={`icon-btn ${
          open ? 'active' : ''
        }`}
        onClick={handleToggleMenu}
        title="Add to playlist"
        aria-label="Add to playlist"
        aria-expanded={open}
      >
        {open ? (
          <X size={18} />
        ) : (
          <Plus size={18} />
        )}
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className={`playlist-dropdown ${
            openUpward
              ? 'open-upward'
              : ''
          }`}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <p className="dropdown-title">
            Add to playlist
          </p>

          {!libraryLoaded ? (
            <p className="dropdown-empty">
              Loading playlists...
            </p>
          ) : (
            <>
              {playlists.length === 0 && (
                <p className="dropdown-empty">
                  No playlists yet
                </p>
              )}

              {playlists.map(
                (playlist) => {
                  const alreadyAdded =
                    isSongInPlaylist(
                      playlist
                    );

                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      className={`dropdown-item ${
                        alreadyAdded
                          ? 'added'
                          : ''
                      }`}
                      onClick={(event) =>
                        handleAdd(
                          event,
                          playlist.id
                        )
                      }
                      title={
                        alreadyAdded
                          ? 'Song is already in this playlist'
                          : `Add to ${playlist.name}`
                      }
                    >
                      <span>
                        {playlist.name}
                      </span>

                      {alreadyAdded && (
                        <Check
                          size={16}
                        />
                      )}
                    </button>
                  );
                }
              )}
            </>
          )}

          <div className="dropdown-divider" />

          {/* CREATE NEW PLAYLIST */}

          <div className="dropdown-create">
            <input
              ref={inputRef}
              type="text"
              placeholder="New playlist name"
              value={newName}
              maxLength={60}
              onChange={(event) =>
                setNewName(
                  event.target.value
                )
              }
              onKeyDown={
                handleInputKeyDown
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              aria-label="New playlist name"
            />

            <button
              type="button"
              onClick={
                handleCreateAndAdd
              }
              disabled={
                !newName.trim()
              }
              title="Create playlist"
              aria-label="Create playlist"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddToPlaylistButton;