import React from 'react';
import { usePlayer } from '../PlayerContext';

const decodeHtml = (text) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
};

function NowPlayingSidebar() {
  const { currentSong, queue, currentIndex, playQueue, sourceName } = usePlayer();

  if (!currentSong) {
    return (
      <div className="now-playing-sidebar empty">
        <p>Nothing playing right now</p>
      </div>
    );
  }

  const upcoming = queue.slice(currentIndex + 1);

  return (
    <div className="now-playing-sidebar">
      <img src={currentSong.image?.[2]?.url} alt={currentSong.name} className="now-playing-art" />
      <h3>{decodeHtml(currentSong.name)}</h3>
      <p className="now-playing-artist">
        {decodeHtml(currentSong.artists?.primary?.map((a) => a.name).join(', ') || '')}
      </p>
      {sourceName && <p className="playing-from">Playing from {sourceName}</p>}

      <h4 className="queue-title">Next Up</h4>
      <div className="queue-list">
        {upcoming.length === 0 && <p className="queue-empty">No more songs in queue</p>}
        {upcoming.map((song, i) => (
          <div
            key={song.id + i}
            className="queue-item"
            onClick={() => playQueue(queue, currentIndex + 1 + i)}
          >
            <img src={song.image?.[0]?.url} alt={song.name || song.title} />
            <div>
              <p className="queue-song-name">{decodeHtml(song.name || song.title)}</p>
              <p className="queue-song-artist">{decodeHtml(song.primaryArtists || song.artists?.primary?.[0]?.name || '')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NowPlayingSidebar;