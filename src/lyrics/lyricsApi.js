import { API_BASE_URL } from '../config';

// ---------------------------------------------------------
// FETCH LYRICS FOR A SONG
// ---------------------------------------------------------

export const fetchLyrics = async ({
  songId,
  name,
  artist = '',
  album = '',
  duration = 0,
}) => {
  if (!songId) {
    return {
      success: false,
      available: false,
      message: 'Song ID is required',
    };
  }

  if (!name) {
    return {
      success: false,
      available: false,
      message: 'Song name is required',
    };
  }

  try {
    const params = new URLSearchParams();

    params.set('name', name);

    if (artist) {
      params.set('artist', artist);
    }

    if (album) {
      params.set('album', album);
    }

    if (
      Number.isFinite(Number(duration)) &&
      Number(duration) > 0
    ) {
      params.set('duration', Number(duration));
    }

    const response = await fetch(
      `${API_BASE_URL}/api/lyrics/${encodeURIComponent(songId)}?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        available: false,
        message:
          data?.message ||
          'Failed to fetch lyrics',
      };
    }

    return data;
  } catch (error) {
    console.error(
      'Lyrics API error:',
      error
    );

    return {
      success: false,
      available: false,
      message:
        'Unable to connect to lyrics service',
    };
  }
};