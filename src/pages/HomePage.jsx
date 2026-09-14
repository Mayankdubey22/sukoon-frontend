import React, {
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import { usePlayer } from '../PlayerContext';

import Carousel from '../components/Carousel';

import {
    Play,
    RefreshCw,
} from 'lucide-react';

import { SkeletonRow } from '../components/SkeletonCard';

import { API_BASE_URL } from '../config';

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
   HOME PAGE
========================================================= */

function HomePage() {
    const [
        sections,
        setSections,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState(null);

    const { playSong } =
        usePlayer();

    /* =======================================================
       FETCH HOME
    ======================================================= */

    const fetchHome = async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await axios.get(
                    `${API_BASE_URL}/api/songs/home`
                );

            const data =
                response.data?.data;

            if (!Array.isArray(data)) {
                throw new Error(
                    'Invalid home response from server.'
                );
            }

            setSections(data);
        } catch (err) {
            console.error(
                'Failed to load home:',
                err
            );

            setSections([]);

            setError(
                'Unable to load the home page. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =======================================================
       LOAD HOME
    ======================================================= */

    useEffect(() => {
        fetchHome();
    }, []);

    /* =======================================================
       LOADING STATE
    ======================================================= */

    if (loading) {
        return (
            <div
                className="
                    min-w-0
                    w-full
                "
            >
                {[
                    'Trending Now',
                    'Bollywood Hits',
                    'Arijit Singh',
                ].map((title) => (
                    <div
                        key={title}
                        className="
                            mb-8
                            min-w-0
                            sm:mb-10
                        "
                    >
                        <h2
                            className="
                                mb-4
                                text-xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:mb-5
                                sm:text-2xl
                            "
                        >
                            {title}
                        </h2>

                        <SkeletonRow />
                    </div>
                ))}
            </div>
        );
    }

    /* =======================================================
       ERROR STATE
    ======================================================= */

    if (error) {
        return (
            <div
                className="
                    flex
                    min-h-[350px]
                    w-full
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    px-5
                    py-10
                    text-center
                    sm:min-h-[400px]
                    sm:px-6
                "
            >
                <h2
                    className="
                        mb-2
                        text-xl
                        font-bold
                        text-white
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
                        text-zinc-400
                        sm:mb-6
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
                        hover:bg-zinc-200
                        active:scale-95
                    "
                    onClick={fetchHome}
                >
                    <RefreshCw size={16} />

                    Try again
                </button>
            </div>
        );
    }

    /* =======================================================
       EMPTY STATE
    ======================================================= */

    if (sections.length === 0) {
        return (
            <div
                className="
                    flex
                    min-h-[350px]
                    w-full
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    px-5
                    py-10
                    text-center
                    sm:min-h-[400px]
                    sm:px-6
                "
            >
                <h2
                    className="
                        mb-2
                        text-xl
                        font-bold
                        text-white
                        sm:text-2xl
                    "
                >
                    No music available
                </h2>

                <p
                    className="
                        mb-5
                        text-sm
                        text-zinc-400
                        sm:mb-6
                    "
                >
                    We couldn't find any music
                    right now.
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
                        hover:bg-zinc-200
                        active:scale-95
                    "
                    onClick={fetchHome}
                >
                    <RefreshCw size={16} />

                    Try again
                </button>
            </div>
        );
    }

    /* =======================================================
       HOME CONTENT
    ======================================================= */

    return (
        <div
            className="
                w-full
                min-w-0
                overflow-x-hidden
            "
        >
            {sections.map((section) => {
                const songs =
                    Array.isArray(
                        section?.songs
                    )
                        ? section.songs
                        : [];

                if (songs.length === 0) {
                    return null;
                }

                return (
                    <section
                        key={section.title}
                        className="
                            mb-8
                            min-w-0
                            sm:mb-10
                        "
                    >
                        <h2
                            className="
                                mb-4
                                text-xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:mb-5
                                sm:text-2xl
                            "
                        >
                            {decodeHtml(
                                section.title ||
                                    'Music'
                            )}
                        </h2>

                        <Carousel
                            items={songs}
                            renderItem={(song) => {
                                if (!song?.id) {
                                    return null;
                                }

                                const image =
                                    song.image?.[2]
                                        ?.url ||
                                    song.image?.[1]
                                        ?.url ||
                                    song.image?.[0]
                                        ?.url ||
                                    '';

                                const artist =
                                    song
                                        .artists
                                        ?.primary?.[0]
                                        ?.name ||
                                    song.primaryArtists ||
                                    'Unknown artist';

                                const songName =
                                    decodeHtml(
                                        song.name ||
                                            'Unknown song'
                                    );

                                const artistName =
                                    decodeHtml(
                                        artist
                                    );

                                return (
                                    <div
                                        key={song.id}
                                        onClick={() =>
                                            playSong(
                                                song
                                            )
                                        }
                                        className="
                                            group
                                            w-[145px]
                                            shrink-0
                                            cursor-pointer
                                            sm:w-[165px]
                                            md:w-[180px]
                                        "
                                    >
                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}

                                        <div
                                            className="
                                                relative
                                                aspect-square
                                                w-full
                                                overflow-hidden
                                                rounded-xl
                                                bg-zinc-800
                                                shadow-md
                                            "
                                        >
                                            {image ? (
                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={
                                                        songName
                                                    }
                                                    loading="lazy"
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                        transition-transform
                                                        duration-300
                                                        group-hover:scale-105
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
                                                        h-full
                                                        w-full
                                                        items-center
                                                        justify-center
                                                        bg-zinc-800
                                                        text-3xl
                                                    "
                                                >
                                                    🎵
                                                </div>
                                            )}

                                            {/* =================================================
                                                PLAY OVERLAY
                                            ================================================= */}

                                            <div
                                                className="
                                                    absolute
                                                    inset-0
                                                    flex
                                                    items-center
                                                    justify-center
                                                    bg-black/40
                                                    opacity-0
                                                    transition-opacity
                                                    duration-300
                                                    group-hover:opacity-100
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-white
                                                        text-black
                                                        shadow-xl
                                                        transition-transform
                                                        duration-300
                                                        group-hover:scale-110
                                                        sm:h-11
                                                        sm:w-11
                                                    "
                                                >
                                                    <Play
                                                        size={18}
                                                        fill="black"
                                                        className="
                                                            sm:h-5
                                                            sm:w-5
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* =================================================
                                            TITLE
                                        ================================================= */}

                                        <p
                                            className="
                                                mt-2
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-white
                                                sm:mt-3
                                            "
                                            title={songName}
                                        >
                                            {songName}
                                        </p>

                                        {/* =================================================
                                            ARTIST
                                        ================================================= */}

                                        <p
                                            className="
                                                mt-0.5
                                                truncate
                                                text-xs
                                                text-zinc-400
                                                sm:mt-1
                                            "
                                            title={
                                                artistName
                                            }
                                        >
                                            {artistName}
                                        </p>
                                    </div>
                                );
                            }}
                        />
                    </section>
                );
            })}

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                className="
                    mt-8
                    border-t
                    border-zinc-800
                    py-6
                    text-center
                    sm:mt-12
                    sm:py-8
                "
            >
                <p
                    className="
                        text-xs
                        text-zinc-500
                        sm:text-sm
                    "
                >
                    🎵 Sukoon — Made for
                    personal use
                </p>
            </footer>
        </div>
    );
}

export default HomePage;