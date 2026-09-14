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
  const [newName, setNewName] = useState('');

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const songId = song?.id;

  const liked = songId
    ? isLiked(songId)
    : false;

  /* =====================================================
     CLOSE WHEN CLICKING OUTSIDE
  ===================================================== */

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

  /* =====================================================
     FOCUS INPUT WHEN MENU OPENS
  ===================================================== */

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  /* =====================================================
     LIKE
  ===================================================== */

  const handleLike = (event) => {
    event.stopPropagation();

    if (!songId) return;

    toggleLike(song);
  };

  /* =====================================================
     TOGGLE PLAYLIST MENU
  ===================================================== */

  const handleToggleMenu = (event) => {
    event.stopPropagation();

    if (!songId || !libraryLoaded) return;

    setOpen((previous) => !previous);
  };

  /* =====================================================
     CHECK PLAYLIST
  ===================================================== */

  const isSongInPlaylist = (playlist) => {
    return playlist.songs?.some(
      (item) => item.id === songId
    );
  };

  /* =====================================================
     ADD TO PLAYLIST
  ===================================================== */

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
  };

  /* =====================================================
     CREATE PLAYLIST
  ===================================================== */

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

  /* =====================================================
     INPUT KEYBOARD
  ===================================================== */

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
      ref={menuRef}
      className="
        relative
        flex
        shrink-0
        items-center
        gap-1
      "
    >
      {/* =================================================
          LIKE BUTTON
      ================================================= */}

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
          bg-transparent
          p-0
          text-center
          transition-all
          duration-200
          ease-out
          hover:bg-[#2a2a2a]
          hover:text-white
          active:scale-95
          ${
            liked
              ? 'text-[#1db954]'
              : 'text-[#b3b3b3]'
          }
        `}
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

      {/* =================================================
          PLAYLIST MENU BUTTON
      ================================================= */}

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
          bg-transparent
          p-0
          text-center
          transition-all
          duration-200
          ease-out
          hover:bg-[#2a2a2a]
          hover:text-white
          active:scale-95
          ${
            open
              ? 'text-[#1db954]'
              : 'text-[#b3b3b3]'
          }
        `}
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

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {open && (
        <div
          className={`
            absolute
            right-0
            z-[1000]

            w-[min(230px,calc(100vw-24px))]

            rounded-[10px]
            border
            border-[#333]
            bg-[#282828]
            p-2.5

            shadow-[0_12px_35px_rgba(0,0,0,0.6)]

            ${
              openUpward
                ? 'bottom-[calc(100%+8px)]'
                : 'top-[calc(100%+8px)]'
            }
          `}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          {/* Dropdown Title */}

          <p
            className="
              m-0
              mb-2
              px-1
              text-[11px]
              font-semibold
              uppercase
              text-[#aaa]
            "
          >
            Add to playlist
          </p>

          {/* =================================================
              PLAYLIST LIST
          ================================================= */}

          {!libraryLoaded ? (
            <p
              className="
                m-2
                text-[13px]
                text-[#888]
              "
            >
              Loading playlists...
            </p>
          ) : (
            <>
              {playlists.length === 0 && (
                <p
                  className="
                    m-2
                    text-[13px]
                    text-[#888]
                  "
                >
                  No playlists yet
                </p>
              )}

              <div
                className="
                  max-h-48
                  overflow-y-auto
                  overscroll-contain
                  pr-0.5
                "
              >
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
                        className={`
                          flex
                          min-h-10
                          w-full
                          items-center
                          justify-between
                          gap-2.5
                          rounded-md
                          bg-transparent
                          px-2
                          py-2
                          text-left
                          text-[13px]
                          text-white
                          transition-colors
                          duration-200
                          hover:bg-[#3a3a3a]
                          active:bg-[#444]
                          ${
                            alreadyAdded
                              ? 'text-[#1db954]'
                              : ''
                          }
                        `}
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
                        <span
                          className="
                            min-w-0
                            flex-1
                            overflow-hidden
                            text-ellipsis
                            whitespace-nowrap
                          "
                        >
                          {playlist.name}
                        </span>

                        {alreadyAdded && (
                          <Check
                            size={16}
                            className="shrink-0"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </>
          )}

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div
            className="
              my-2
              h-px
              bg-[#444]
            "
          />

          {/* =================================================
              CREATE NEW PLAYLIST
          ================================================= */}

          <div
            className="
              flex
              gap-1.5
            "
          >
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
              className="
                min-w-0
                flex-1
                rounded-md
                bg-[#1a1a1a]
                px-2
                py-2
                text-xs
                text-white
                outline-none
                placeholder:text-[#777]
                focus:bg-[#202020]
                focus:ring-1
                focus:ring-[#1db954]/40
              "
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
              className="
                flex
                h-[34px]
                w-[34px]
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-[#1db954]
                p-0
                text-black
                transition-all
                duration-200
                hover:bg-[#1ed760]
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-35
              "
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