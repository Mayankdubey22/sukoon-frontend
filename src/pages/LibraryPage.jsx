import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  ListMusic,
  Music2,
  ArrowLeft,
  Play,
} from 'lucide-react';

import { useLibrary } from '../LibraryContext';

function LibraryPage() {
  const {
    likedSongs,
    playlists,
    likedPlaylists,
    createPlaylist,
  } = useLibrary();

  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = () => {
    const name = newPlaylistName.trim();

    if (!name) return;

    createPlaylist(name);

    setNewPlaylistName('');
    setShowInput(false);
  };

  return (
    <main className="min-h-full bg-[#0f0f0f] px-4 py-5 text-white sm:px-6 sm:py-6 lg:px-8">

      {/* HEADER */}
      <header className="mb-6 flex items-center gap-3">

        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            COLLECTION
          </span>

          <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Your Library
          </h1>
        </div>

        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
          onClick={() => setShowInput(!showInput)}
          aria-label="Create playlist"
        >
          <Plus size={22} />
        </button>

      </header>


      {/* CREATE PLAYLIST */}
      {showInput && (
        <div className="mb-7 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:flex-row">

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3">

            <Music2
              size={18}
              className="shrink-0 text-gray-400"
            />

            <input
              type="text"
              placeholder="Name your playlist..."
              value={newPlaylistName}
              onChange={(e) =>
                setNewPlaylistName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }

                if (e.key === 'Escape') {
                  setShowInput(false);
                  setNewPlaylistName('');
                }
              }}
              autoFocus
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-500"
            />

          </div>

          <button
            className="rounded-lg bg-[#1db954] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#1ed760] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleCreate}
          >
            Create
          </button>

        </div>
      )}


      {/* LIKED SONGS */}
      <section className="mb-9">

        <button
          className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#3b176d] via-[#542080] to-[#1e1e1e] p-5 text-left shadow-lg transition hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] sm:p-6"
          onClick={() => navigate('/liked')}
        >

          {/* Background glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg sm:h-24 sm:w-24">

            <Heart
              size={42}
              fill="currentColor"
              strokeWidth={1.7}
              className="text-white sm:h-[54px] sm:w-[54px]"
            />

          </div>

          <div className="relative min-w-0 flex-1">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              PLAYLIST
            </span>

            <h2 className="mt-1 truncate text-xl font-bold sm:text-2xl">
              Liked Songs
            </h2>

            <p className="mt-1 text-sm text-white/60">
              {likedSongs.length}{' '}
              {likedSongs.length === 1
                ? 'song'
                : 'songs'}
            </p>

          </div>

          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black opacity-90 shadow-md transition group-hover:scale-105 group-hover:opacity-100">

            <Play
              size={19}
              fill="currentColor"
            />

          </span>

        </button>

      </section>


      {/* YOUR PLAYLISTS */}
      <section className="mb-10">

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              PERSONAL
            </span>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Your Playlists
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your personal collection
            </p>
          </div>

          {playlists.length > 0 && (
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-gray-300">
              {playlists.length}
            </span>
          )}

        </div>


        {playlists.length === 0 ? (

          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-5 py-12 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-500">
              <Music2 size={28} />
            </div>

            <h3 className="text-base font-semibold">
              Your playlists are empty
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Create your first playlist and
              start building your collection.
            </p>

            <button
              className="mt-5 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
              onClick={() => setShowInput(true)}
            >
              <Plus size={18} />
              Create playlist
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

            {playlists.map((playlist) => (

              <button
                key={playlist.id}
                className="group min-w-0 rounded-xl p-2 text-left transition hover:bg-white/[0.06] active:scale-[0.98]"
                onClick={() =>
                  navigate(
                    `/playlist/local/${playlist.id}`
                  )
                }
              >

                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#242424] shadow-md">

                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#292929] to-[#181818] text-gray-500 transition group-hover:scale-105">

                    <ListMusic
                      size={42}
                    />

                  </div>

                  <span className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#1db954] text-black opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">

                    <Play
                      size={18}
                      fill="currentColor"
                    />

                  </span>

                </div>

                <div className="px-0.5 pt-3">

                  <h3 className="truncate text-sm font-semibold text-white">
                    {playlist.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {playlist.songs.length}{' '}
                    {playlist.songs.length === 1
                      ? 'song'
                      : 'songs'}
                  </p>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>


      {/* LIKED ONLINE PLAYLISTS */}
      {likedPlaylists.length > 0 && (

        <section className="mb-10">

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                SAVED
              </span>

              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                Liked Playlists
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Playlists you've saved
              </p>
            </div>

            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-semibold text-gray-300">
              {likedPlaylists.length}
            </span>

          </div>


          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

            {likedPlaylists.map((playlist) => {

              const imageUrl =
                playlist.image?.[1]?.url ||
                playlist.image?.[0]?.url ||
                '';

              return (

                <button
                  key={playlist.id}
                  className="group min-w-0 rounded-xl p-2 text-left transition hover:bg-white/[0.06] active:scale-[0.98]"
                  onClick={() =>
                    navigate(
                      `/playlist/${playlist.id}`
                    )
                  }
                >

                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#242424] shadow-md">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#292929] to-[#181818] text-gray-500">

                        <ListMusic
                          size={42}
                        />

                      </div>

                    )}

                    <span className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#1db954] text-black opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">

                      <Play
                        size={18}
                        fill="currentColor"
                      />

                    </span>

                  </div>

                  <div className="px-0.5 pt-3">

                    <h3 className="truncate text-sm font-semibold text-white">
                      {playlist.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Liked playlist
                    </p>

                  </div>

                </button>

              );
            })}

          </div>

        </section>

      )}

    </main>
  );
}

export default LibraryPage;