import React, { useState } from 'react';
import { useLibrary } from '../LibraryContext';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  ListMusic,
  Music2,
} from 'lucide-react';

function Sidebar() {
  const {
    likedSongs,
    playlists,
    likedPlaylists,
    createPlaylist,
  } = useLibrary();

  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] =
    useState('');

  const handleCreate = () => {
    const name = newPlaylistName.trim();

    if (!name) return;

    createPlaylist(name);

    setNewPlaylistName('');
    setShowInput(false);
  };

  const handlePlaylistClick = (playlistId) => {
    if (!playlistId) return;

    navigate(`/playlist/local/${playlistId}`);
  };

  const handleSavedPlaylistClick = (playlistId) => {
    if (!playlistId) return;

    navigate(`/playlist/${playlistId}`);
  };

  return (
    <aside
      className="
        min-h-0
        h-full
        w-full
        overflow-y-auto
        overflow-x-hidden
        rounded-[10px]
        bg-[#121212]
        px-2
        sm:px-3
        pt-3
        sm:pt-[18px]
        pb-[120px]
        text-white
        scrollbar-thin
        scrollbar-track-transparent
        scrollbar-thumb-[#555]
      "
    >
      {/* =====================================================
          LIBRARY HEADER
      ===================================================== */}

      <div
        className="
          mb-[14px]
          flex
          items-center
          justify-between
          gap-2
          px-1
          sm:px-[6px]
        "
      >
        <div className="min-w-0">
          <p
            className="
              m-0
              mb-1
              text-[9px]
              sm:text-[10px]
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#777]
            "
          >
            YOUR MUSIC
          </p>

          <h3
            className="
              m-0
              truncate
              text-[15px]
              sm:text-[16px]
              font-semibold
              text-white
            "
          >
            Your Library
          </h3>
        </div>

        <button
          type="button"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border-none
            bg-transparent
            p-0
            text-[#b3b3b3]
            transition
            duration-200
            hover:bg-[#2a2a2a]
            hover:text-white
            active:scale-95
          "
          onClick={() =>
            setShowInput((previous) => !previous)
          }
          title="Create playlist"
          aria-label="Create playlist"
          aria-expanded={showInput}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* =====================================================
          CREATE PLAYLIST
      ===================================================== */}

      {showInput && (
        <div
          className="
            mb-[14px]
            flex
            w-full
            gap-2
            px-1
            sm:px-[6px]
          "
        >
          <input
            type="text"
            placeholder="Playlist name"
            value={newPlaylistName}
            maxLength={60}
            onChange={(event) =>
              setNewPlaylistName(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleCreate();
              }

              if (event.key === 'Escape') {
                setShowInput(false);
                setNewPlaylistName('');
              }
            }}
            autoFocus
            aria-label="Playlist name"
            className="
              min-w-0
              flex-1
              rounded-[6px]
              border-none
              bg-[#2a2a2a]
              px-[10px]
              py-[9px]
              text-[13px]
              text-white
              outline-none
              placeholder:text-[#777]
              focus:bg-[#333]
              focus:ring-1
              focus:ring-[#555]
            "
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={!newPlaylistName.trim()}
            className="
              shrink-0
              rounded-[6px]
              border-none
              bg-[#1db954]
              px-3
              py-2
              text-[13px]
              font-semibold
              text-black
              transition
              duration-200
              hover:bg-[#1ed760]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Create
          </button>
        </div>
      )}

      {/* =====================================================
          LIKED SONGS
      ===================================================== */}

      <div
        role="button"
        tabIndex={0}
        className="
          group
          flex
          w-full
          cursor-pointer
          items-center
          gap-[10px]
          rounded-[7px]
          px-2
          py-[10px]
          text-[#b3b3b3]
          transition
          duration-200
          hover:bg-[#242424]
          hover:text-white
          active:bg-[#2a2a2a]
        "
        onClick={() => navigate('/liked')}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault();
            navigate('/liked');
          }
        }}
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-[6px]
            bg-gradient-to-br
            from-[#450af5]
            to-[#8e8ee8]
            text-white
          "
        >
          <Heart
            size={18}
            fill="currentColor"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              m-0
              truncate
              text-[13px]
              sm:text-[14px]
              font-medium
              text-white
            "
          >
            Liked Songs
          </p>

          <span
            className="
              block
              truncate
              text-[11px]
              sm:text-[12px]
              text-[#888]
            "
          >
            {likedSongs.length}{' '}
            {likedSongs.length === 1
              ? 'song'
              : 'songs'}
          </span>
        </div>
      </div>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div
        className="
          my-[14px]
          mx-1
          h-px
          bg-[#2a2a2a]
        "
      />

      {/* =====================================================
          LOCAL PLAYLISTS
      ===================================================== */}

      {playlists.length > 0 && (
        <>
          <p
            className="
              mb-2
              mt-0
              px-1
              sm:px-[6px]
              text-[9px]
              sm:text-[10px]
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#777]
            "
          >
            PLAYLISTS
          </p>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              role="button"
              tabIndex={0}
              className="
                mb-1
                flex
                w-full
                cursor-pointer
                items-center
                gap-[10px]
                rounded-[7px]
                px-2
                py-[10px]
                text-[#b3b3b3]
                transition
                duration-200
                hover:bg-[#242424]
                hover:text-white
                active:bg-[#2a2a2a]
              "
              onClick={() =>
                handlePlaylistClick(pl.id)
              }
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault();
                  handlePlaylistClick(pl.id);
                }
              }}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-[6px]
                  bg-[#333]
                  text-white
                "
              >
                <ListMusic size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    truncate
                    text-[13px]
                    sm:text-[14px]
                    font-medium
                    text-white
                  "
                >
                  {pl.name || 'Untitled Playlist'}
                </p>

                <span
                  className="
                    block
                    truncate
                    text-[11px]
                    sm:text-[12px]
                    text-[#888]
                  "
                >
                  {Array.isArray(pl.songs)
                    ? pl.songs.length
                    : 0}{' '}
                  {Array.isArray(pl.songs) &&
                  pl.songs.length === 1
                    ? 'song'
                    : 'songs'}
                </span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* =====================================================
          SAVED ONLINE PLAYLISTS
      ===================================================== */}

      {likedPlaylists.length > 0 && (
        <>
          <p
            className="
              mb-2
              mt-[18px]
              px-1
              sm:px-[6px]
              text-[9px]
              sm:text-[10px]
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#777]
            "
          >
            SAVED PLAYLISTS
          </p>

          {likedPlaylists.map((pl) => {
            const imageUrl =
              pl.image?.[2]?.url ||
              pl.image?.[1]?.url ||
              pl.image?.[0]?.url;

            return (
              <div
                key={pl.id}
                role="button"
                tabIndex={0}
                className="
                  mb-1
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  gap-[10px]
                  rounded-[7px]
                  px-2
                  py-[10px]
                  text-[#b3b3b3]
                  transition
                  duration-200
                  hover:bg-[#242424]
                  hover:text-white
                  active:bg-[#2a2a2a]
                "
                onClick={() =>
                  handleSavedPlaylistClick(pl.id)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ' '
                  ) {
                    event.preventDefault();
                    handleSavedPlaylistClick(
                      pl.id
                    );
                  }
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={pl.name || 'Playlist'}
                    loading="lazy"
                    className="
                      h-9
                      w-9
                      shrink-0
                      rounded-[6px]
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[6px]
                      bg-[#333]
                      text-white
                    "
                  >
                    <Music2 size={18} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      m-0
                      truncate
                      text-[13px]
                      sm:text-[14px]
                      font-medium
                      text-white
                    "
                  >
                    {pl.name || 'Untitled Playlist'}
                  </p>

                  <span
                    className="
                      block
                      truncate
                      text-[11px]
                      sm:text-[12px]
                      text-[#888]
                    "
                  >
                    Saved playlist
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {playlists.length === 0 &&
        likedPlaylists.length === 0 && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-4
              py-10
              text-center
              text-[#777]
            "
          >
            <Music2
              size={28}
              className="mb-3 opacity-70"
            />

            <p
              className="
                m-0
                text-[12px]
                sm:text-[13px]
                leading-relaxed
              "
            >
              Your playlists will appear here
            </p>
          </div>
        )}
    </aside>
  );
}

export default Sidebar;