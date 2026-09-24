import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { fetchLyrics } from './lyricsApi';
import LyricsLine from './LyricsLine';

const Lyrics = ({
  song,
  currentTime = 0,
  onSeek,
}) => {
  const [lyricsData, setLyricsData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
    Used to immediately reflect a lyric click
    before the audio element fires its next
    timeupdate event.
  */
  const [manualSeekTime, setManualSeekTime] =
    useState(null);

  const activeLineRef =
    useRef(null);

  const previousActiveIndexRef =
    useRef(-1);

  // -------------------------------------------------------
  // NORMALIZE CURRENT TIME
  // -------------------------------------------------------

  const playbackTime =
    Number(currentTime);

  const safeCurrentTime =
    Number.isFinite(playbackTime) &&
    playbackTime >= 0
      ? playbackTime
      : 0;

  // -------------------------------------------------------
  // RESET MANUAL SEEK WHEN AUDIO TIME CATCHES UP
  // -------------------------------------------------------

  useEffect(() => {
    if (
      manualSeekTime === null
    ) {
      return;
    }

    /*
      Once the real audio currentTime is close
      to the requested seek position, let the
      actual audio time control the lyrics again.
    */
    if (
      Math.abs(
        safeCurrentTime -
          manualSeekTime
      ) < 0.5
    ) {
      setManualSeekTime(null);
    }
  }, [
    safeCurrentTime,
    manualSeekTime,
  ]);

  // -------------------------------------------------------
  // LOAD LYRICS WHEN SONG CHANGES
  // -------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadLyrics = async () => {
      if (!song?.id) {
        setLyricsData(null);
        setError('');
        setLoading(false);
        setManualSeekTime(null);
        previousActiveIndexRef.current = -1;
        return;
      }

      setLoading(true);
      setError('');
      setLyricsData(null);
      setManualSeekTime(null);
      previousActiveIndexRef.current = -1;

      const result =
        await fetchLyrics({
          songId: song.id,

          name:
            song.name ||
            song.title ||
            '',

          artist:
            song.artist ||
            song.primaryArtists ||
            '',

          album:
            song.album?.name ||
            song.album ||
            '',

          duration:
            Number(song.duration) || 0,
        });

      if (cancelled) {
        return;
      }

      if (!result?.success) {
        setError(
          result?.message ||
            'Failed to load lyrics'
        );

        setLyricsData(null);
        setLoading(false);
        return;
      }

      if (!result.available) {
        setError(
          result.message ||
            'Lyrics are not available for this song.'
        );

        setLyricsData(null);
        setLoading(false);
        return;
      }

      setLyricsData(result.data);
      setLoading(false);
    };

    loadLyrics();

    return () => {
      cancelled = true;
    };
  }, [song?.id]);

  // -------------------------------------------------------
  // NORMALIZE SYNCED LYRICS
  // -------------------------------------------------------

  const syncedLyrics = useMemo(() => {
    if (
      !Array.isArray(
        lyricsData?.syncedLyrics
      )
    ) {
      return [];
    }

    const normalized =
      lyricsData.syncedLyrics
        .map((line) => ({
          ...line,

          time: Number(
            line?.time
          ),

          text:
            typeof line?.text ===
            'string'
              ? line.text.trim()
              : '',
        }))
        .filter(
          (line) =>
            Number.isFinite(
              line.time
            ) &&
            line.time >= 0 &&
            line.text.length > 0
        )
        .sort(
          (a, b) =>
            a.time - b.time
        );

    // -----------------------------------------------------
    // REMOVE EXACT DUPLICATES
    // -----------------------------------------------------

    const cleaned = [];

    for (
      const line of normalized
    ) {
      const previous =
        cleaned[
          cleaned.length - 1
        ];

      if (
        previous &&
        previous.time ===
          line.time &&
        previous.text ===
          line.text
      ) {
        continue;
      }

      cleaned.push(line);
    }

    return cleaned;
  }, [lyricsData]);

  // -------------------------------------------------------
  // EFFECTIVE PLAYBACK TIME
  // -------------------------------------------------------

  const effectiveCurrentTime =
    manualSeekTime !== null
      ? manualSeekTime
      : safeCurrentTime;

  // -------------------------------------------------------
  // FIND ACTIVE SYNCED LYRIC
  //
  // Uses binary search instead of checking every
  // lyric line on every audio update.
  // -------------------------------------------------------

  const activeLineIndex =
    useMemo(() => {
      if (
        syncedLyrics.length === 0
      ) {
        return -1;
      }

      const time =
        Number(
          effectiveCurrentTime
        );

      if (
        !Number.isFinite(time) ||
        time < 0
      ) {
        return -1;
      }

      let left = 0;

      let right =
        syncedLyrics.length - 1;

      let activeIndex = -1;

      while (
        left <= right
      ) {
        const middle =
          Math.floor(
            (left + right) / 2
          );

        const lineTime =
          Number(
            syncedLyrics[
              middle
            ].time
          );

        if (
          time >= lineTime
        ) {
          activeIndex = middle;
          left = middle + 1;
        } else {
          right = middle - 1;
        }
      }

      return activeIndex;
    }, [
      syncedLyrics,
      effectiveCurrentTime,
    ]);

  // -------------------------------------------------------
  // AUTO-SCROLL TO ACTIVE LINE
  // -------------------------------------------------------

  useEffect(() => {
    if (
      activeLineIndex < 0 ||
      !activeLineRef.current
    ) {
      return;
    }

    const previousIndex =
      previousActiveIndexRef.current;

    const indexChanged =
      previousIndex !==
      activeLineIndex;

    previousActiveIndexRef.current =
      activeLineIndex;

    /*
      During a manual seek, scroll immediately
      instead of performing a long smooth
      animation from the previous lyric.
    */
    activeLineRef.current.scrollIntoView({
      behavior:
        indexChanged &&
        manualSeekTime === null
          ? 'smooth'
          : 'auto',

      block: 'center',
    });
  }, [
    activeLineIndex,
    manualSeekTime,
  ]);

  // -------------------------------------------------------
  // SEEK TO LYRIC
  // -------------------------------------------------------

  const handleLineClick = (
    time
  ) => {
    const seekTime =
      Number(time);

    if (
      typeof onSeek !==
        'function' ||
      !Number.isFinite(
        seekTime
      ) ||
      seekTime < 0
    ) {
      return;
    }

    /*
      Immediately update the lyric UI.
      This prevents waiting for the next
      audio timeupdate event.
    */
    setManualSeekTime(
      seekTime
    );

    onSeek(seekTime);
  };

  // -------------------------------------------------------
  // NO SONG
  // -------------------------------------------------------

  if (!song?.id) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center px-6 text-center text-white/40">
        <p>
          Select a song to see its lyrics.
        </p>
      </div>
    );
  }

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/50">
            Loading lyrics...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // LYRICS NOT AVAILABLE
  // -------------------------------------------------------

  if (
    !lyricsData ||
    (
      !lyricsData.lyrics &&
      !lyricsData.isSynced
    )
  ) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center px-6 text-center">
        <div>
          <p className="text-base font-medium text-white/60">
            {error ||
              'Lyrics are not available for this song.'}
          </p>

          <p className="mt-2 text-xs text-white/30">
            Try another song.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // SYNCED LYRICS
  // -------------------------------------------------------

  if (
    lyricsData.isSynced &&
    syncedLyrics.length > 0
  ) {
    return (
      <div className="h-full overflow-y-auto px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="space-y-1">
            {syncedLyrics.map(
              (line, index) => {
                const isActive =
                  index ===
                  activeLineIndex;

                return (
                  <div
                    key={`${line.time}-${index}`}
                    ref={
                      isActive
                        ? activeLineRef
                        : null
                    }
                  >
                    <LyricsLine
                      text={line.text}
                      isActive={
                        isActive
                      }
                      onClick={() =>
                        handleLineClick(
                          line.time
                        )
                      }
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // PLAIN LYRICS
  // -------------------------------------------------------

  const plainLines =
    typeof lyricsData.lyrics ===
    'string'
      ? lyricsData.lyrics
          .split(/\r?\n/)
          .filter(
            (line) =>
              line.trim()
          )
      : [];

  return (
    <div className="h-full overflow-y-auto px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="space-y-2">
          {plainLines.map(
            (line, index) => (
              <LyricsLine
                key={`${index}-${line}`}
                text={line}
                isActive={false}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Lyrics;