import React, {
    useEffect,
    useState,
} from 'react';

import {
    useParams,
} from 'react-router-dom';

import axios from 'axios';

import {
    Play,
    RefreshCw,
} from 'lucide-react';

import {
    usePlayer,
} from '../PlayerContext';

import AddToPlaylistButton from '../components/AddToPlaylistButton';

import {
    API_BASE_URL,
} from '../config';

/* =========================================================
   DECODE HTML
========================================================= */

const decodeHtml = (text = '') => {
    const txt =
        document.createElement('textarea');

    txt.innerHTML = text;

    return txt.value;
};

/* =========================================================
   ARTIST PAGE
========================================================= */

function ArtistPage() {
    const { id } = useParams();

    const [
        artist,
        setArtist,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState(null);

    const {
        playQueue,
        currentSong,
    } = usePlayer();

    /* =======================================================
       FETCH ARTIST
    ======================================================= */

    const fetchArtist = async () => {
        if (!id) {
            setArtist(null);
            setError('Invalid artist.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response =
                await axios.get(
                    `${API_BASE_URL}/api/songs/artist/${id}`
                );

            const data =
                response.data?.data;

            if (!data) {
                throw new Error(
                    'Invalid artist response.'
                );
            }

            setArtist(data);
        } catch (err) {
            console.error(
                'Failed to load artist:',
                err
            );

            setArtist(null);

            setError(
                'Unable to load this artist. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =======================================================
       LOAD WHEN ID CHANGES
    ======================================================= */

    useEffect(() => {
        fetchArtist();
    }, [id]);

    /* =======================================================
       SONGS
    ======================================================= */

    const songs =
        Array.isArray(artist?.topSongs)
            ? artist.topSongs
            : [];

    /* =======================================================
       PLAY ALL
    ======================================================= */

    const handlePlayAll = () => {
        if (songs.length === 0) {
            return;
        }

        playQueue(
            songs,
            0,
            artist?.name || 'Artist'
        );
    };

    /* =======================================================
       ARTIST IMAGE
    ======================================================= */

    const artistImage =
        artist?.image?.[2]?.url ||
        artist?.image?.[1]?.url ||
        artist?.image?.[0]?.url ||
        '';

    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-full
                    items-center
                    justify-center
                    px-5
                    py-12
                    text-white
                "
            >
                <p
                    className="
                        text-sm
                        text-gray-400
                        sm:text-base
                    "
                >
                    Loading artist...
                </p>
            </div>
        );
    }

    /* =======================================================
       ERROR
    ======================================================= */

    if (error) {
        return (
            <div
                className="
                    flex
                    min-h-full
                    flex-col
                    items-center
                    justify-center
                    px-5
                    py-12
                    text-center
                    text-white
                "
            >
                <h2
                    className="
                        mb-2
                        text-xl
                        font-bold
                        sm:text-2xl
                    "
                >
                    Something went wrong
                </h2>

                <p
                    className="
                        mb-5
                        max-w-md
                        text-sm
                        text-gray-400
                        sm:text-base
                    "
                >
                    {error}
                </p>

                <button
                    type="button"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-white
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-black
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:bg-gray-200
                        active:scale-95
                    "
                    onClick={fetchArtist}
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    /* =======================================================
       ARTIST NOT FOUND
    ======================================================= */

    if (!artist) {
        return (
            <div
                className="
                    flex
                    min-h-full
                    flex-col
                    items-center
                    justify-center
                    px-5
                    py-12
                    text-center
                    text-white
                "
            >
                <h2
                    className="
                        mb-2
                        text-xl
                        font-bold
                        sm:text-2xl
                    "
                >
                    Artist not found
                </h2>

                <p
                    className="
                        text-sm
                        text-gray-400
                        sm:text-base
                    "
                >
                    We couldn't find this artist.
                </p>
            </div>
        );
    }

    /* =======================================================
       ARTIST DATA
    ======================================================= */

    const artistName =
        decodeHtml(
            artist.name ||
                'Unknown artist'
        );

    const followers =
        artist.followerCount ??
        artist.followers ??
        null;

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <div
            className="
                min-w-0
                px-4
                py-5
                text-white
                sm:px-5
                sm:py-6
                md:px-6
                lg:px-7
            "
        >
            {/* =================================================
                ARTIST HEADER
            ================================================= */}

            <div
                className="
                    mb-7
                    flex
                    min-w-0
                    flex-col
                    items-center
                    gap-4
                    sm:mb-8
                    sm:flex-row
                    sm:items-center
                    sm:gap-5
                    md:gap-6
                "
            >
                {/* =================================================
                    ARTIST IMAGE
                ================================================= */}

                <div
                    className="
                        h-[120px]
                        w-[120px]
                        shrink-0
                        sm:h-[160px]
                        sm:w-[160px]
                        md:h-[200px]
                        md:w-[200px]
                    "
                >
                    {artistImage ? (
                        <img
                            src={artistImage}
                            alt={artistName}
                            className="
                                h-full
                                w-full
                                rounded-full
                                object-cover
                                shadow-lg
                            "
                            onError={(event) => {
                                event.currentTarget.style.display =
                                    'none';
                            }}
                        />
                    ) : (
                        <div
                            className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                rounded-full
                                bg-[#282828]
                                text-4xl
                                sm:text-5xl
                            "
                        >
                            🎤
                        </div>
                    )}
                </div>

                {/* =================================================
                    ARTIST INFO
                ================================================= */}

                <div
                    className="
                        min-w-0
                        w-full
                        flex-1
                        text-center
                        sm:w-auto
                        sm:text-left
                    "
                >
                    <p
                        className="
                            m-0
                            text-xs
                            text-gray-400
                            sm:text-sm
                        "
                    >
                        Artist
                    </p>

                    <h1
                        className="
                            my-1
                            line-clamp-2
                            text-2xl
                            font-bold
                            leading-tight
                            sm:text-3xl
                            md:text-4xl
                        "
                        title={artistName}
                    >
                        {artistName}
                    </h1>

                    {followers !== null && (
                        <p
                            className="
                                mt-2
                                truncate
                                text-xs
                                text-gray-400
                                sm:text-sm
                            "
                        >
                            {Number(
                                followers
                            ).toLocaleString()}{' '}
                            followers
                        </p>
                    )}
                </div>

                {/* =================================================
                    PLAY ALL
                ================================================= */}

                {songs.length > 0 && (
                    <button
                        type="button"
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#1db954]
                            text-black
                            shadow-lg
                            shadow-black/20
                            transition-all
                            duration-200
                            hover:scale-105
                            hover:bg-[#1ed760]
                            active:scale-95
                            sm:h-12
                            sm:w-12
                        "
                        onClick={handlePlayAll}
                        title="Play top songs"
                        aria-label="Play top songs"
                    >
                        <Play
                            size={20}
                            fill="black"
                            className="
                                sm:h-[22px]
                                sm:w-[22px]
                            "
                        />
                    </button>
                )}
            </div>

            {/* =================================================
                TOP SONGS
            ================================================= */}

            <h2
                className="
                    mb-3
                    text-xl
                    font-bold
                    sm:mb-4
                    sm:text-2xl
                "
            >
                Top Songs
            </h2>

            {/* =================================================
                EMPTY SONGS
            ================================================= */}

            {songs.length === 0 ? (
                <div
                    className="
                        px-4
                        py-8
                        text-center
                        sm:py-10
                    "
                >
                    <h3
                        className="
                            mb-2
                            text-base
                            font-semibold
                            sm:text-lg
                        "
                    >
                        No songs available
                    </h3>

                    <p
                        className="
                            text-sm
                            text-gray-400
                            sm:text-base
                        "
                    >
                        We couldn't find any songs
                        for this artist right now.
                    </p>
                </div>
            ) : (
                /* =================================================
                   SONG LIST
                ================================================= */

                <div
                    className="
                        flex
                        min-w-0
                        flex-col
                    "
                >
                    {songs.map(
                        (song, index) => {
                            if (!song?.id) {
                                return null;
                            }

                            const songImage =
                                song.image?.[2]?.url ||
                                song.image?.[1]?.url ||
                                song.image?.[0]?.url ||
                                '';

                            const songArtist =
                                song.artists
                                    ?.primary
                                    ?.map(
                                        (item) =>
                                            item.name
                                    )
                                    .join(', ') ||
                                song.primaryArtists ||
                                artist.name ||
                                'Unknown artist';

                            const songName =
                                decodeHtml(
                                    song.name ||
                                        'Unknown song'
                                );

                            const artistNameForSong =
                                decodeHtml(
                                    songArtist
                                );

                            const isPlaying =
                                currentSong?.id ===
                                song.id;

                            return (
                                <div
                                    key={song.id}
                                    className={`
                                        group
                                        flex
                                        min-h-[62px]
                                        min-w-0
                                        items-center
                                        gap-2
                                        rounded-lg
                                        px-2
                                        py-2
                                        transition-colors
                                        duration-200
                                        sm:min-h-[66px]
                                        sm:gap-3
                                        sm:px-3
                                        ${
                                            isPlaying
                                                ? 'bg-[#282828]'
                                                : 'hover:bg-[#181818]'
                                        }
                                    `}
                                >
                                    {/* =================================================
                                        SONG MAIN AREA
                                    ================================================= */}

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            flex-1
                                            cursor-pointer
                                            items-center
                                            gap-3
                                        "
                                        onClick={() =>
                                            playQueue(
                                                songs,
                                                index,
                                                artistName
                                            )
                                        }
                                    >
                                        {/* SONG IMAGE */}

                                        {songImage ? (
                                            <img
                                                src={
                                                    songImage
                                                }
                                                alt={
                                                    songName
                                                }
                                                loading="lazy"
                                                className="
                                                    h-[46px]
                                                    w-[46px]
                                                    shrink-0
                                                    rounded
                                                    object-cover
                                                    sm:h-[50px]
                                                    sm:w-[50px]
                                                "
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="
                                                    flex
                                                    h-[46px]
                                                    w-[46px]
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded
                                                    bg-[#282828]
                                                    text-sm
                                                    sm:h-[50px]
                                                    sm:w-[50px]
                                                "
                                            >
                                                🎵
                                            </div>
                                        )}

                                        {/* SONG INFO */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >
                                            <p
                                                className={`
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    ${
                                                        isPlaying
                                                            ? 'text-[#1db954]'
                                                            : 'text-white'
                                                    }
                                                `}
                                                title={
                                                    songName
                                                }
                                            >
                                                {songName}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-xs
                                                    text-gray-400
                                                    sm:mt-1
                                                    sm:text-sm
                                                "
                                                title={
                                                    artistNameForSong
                                                }
                                            >
                                                {
                                                    artistNameForSong
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* =================================================
                                        PLAYLIST BUTTON
                                    ================================================= */}

                                    <div
                                        className="
                                            shrink-0
                                        "
                                    >
                                        <AddToPlaylistButton
                                            song={song}
                                        />
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}

export default ArtistPage;