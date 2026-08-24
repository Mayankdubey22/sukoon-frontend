import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlayer } from '../PlayerContext';
import Carousel from '../components/Carousel';
import { Play } from 'lucide-react';
import { SkeletonRow } from '../components/SkeletonCard';
import { API_BASE_URL } from '../config'; // adjust path: use './config' if the file is directly in src/

const decodeHtml = (text) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
};

function HomePage() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/songs/home`)
            .then((res) => setSections(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div>
                {['Trending Now', 'Bollywood Hits', 'Arijit Singh'].map((title) => (
                    <div className="section" key={title}>
                        <h2>{title}</h2>
                        <SkeletonRow />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {sections.map((section) => (
                <div className="section" key={section.title}>
                    <h2>{section.title}</h2>
                    <Carousel
                        items={section.songs}
                        renderItem={(song) => (
                            <div key={song.id} className="album-card" onClick={() => playSong(song)}>
                                <div className="card-image-wrapper">
                                    <img src={song.image?.[1]?.url} alt={song.name} />
                                    <div className="play-overlay">
                                        <Play size={20} fill="black" />
                                    </div>
                                </div>
                                <p className="card-title">{decodeHtml(song.name)}</p>
                                <p className="card-subtitle">{decodeHtml(song.artists?.primary?.[0]?.name || song.primaryArtists || '')}</p>
                            </div>
                        )}
                    />
                </div>
            ))}

            <footer className="app-footer">
                <p>🎵 Sukoon — Made for personal use</p>
            </footer>
        </div>
    );
}

export default HomePage;