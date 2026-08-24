import React, { createContext, useState, useContext, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);

    useEffect(() => {
        const savedLiked = localStorage.getItem('likedSongs');
        const savedPlaylists = localStorage.getItem('playlists');
        const savedLikedPlaylists = localStorage.getItem('likedPlaylists');
        if (savedLikedPlaylists) setLikedPlaylists(JSON.parse(savedLikedPlaylists));
        if (savedLiked) setLikedSongs(JSON.parse(savedLiked));
        if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    }, []);

    const isPlaylistLiked = (playlistId) => likedPlaylists.some((p) => p.id === playlistId);

    const toggleLikePlaylist = (playlist) => {
        setLikedPlaylists((prev) => {
            const exists = prev.find((p) => p.id === playlist.id);
            const updated = exists
                ? prev.filter((p) => p.id !== playlist.id)
                : [...prev, { id: playlist.id, name: playlist.name, image: playlist.image }];
            localStorage.setItem('likedPlaylists', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleLike = (song) => {
        setLikedSongs((prev) => {
            const exists = prev.find((s) => s.id === song.id);
            const updated = exists ? prev.filter((s) => s.id !== song.id) : [...prev, song];
            localStorage.setItem('likedSongs', JSON.stringify(updated));
            return updated;
        });
    };

    const isLiked = (songId) => likedSongs.some((s) => s.id === songId);

    const createPlaylist = (name, songToAdd = null) => {
        const newPlaylist = { id: Date.now().toString(), name, songs: songToAdd ? [songToAdd] : [] };
        setPlaylists((prev) => {
            const updated = [...prev, newPlaylist];
            localStorage.setItem('playlists', JSON.stringify(updated));
            return updated;
        });
        return newPlaylist;
    };

    const addToPlaylist = (playlistId, song) => {
        setPlaylists((prev) => {
            const updated = prev.map((pl) =>
                pl.id === playlistId && !pl.songs.find((s) => s.id === song.id)
                    ? { ...pl, songs: [...pl.songs, song] }
                    : pl
            );
            localStorage.setItem('playlists', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromPlaylist = (playlistId, songId) => {
        setPlaylists((prev) => {
            const updated = prev.map((pl) =>
                pl.id === playlistId ? { ...pl, songs: pl.songs.filter((s) => s.id !== songId) } : pl
            );
            localStorage.setItem('playlists', JSON.stringify(updated));
            return updated;
        });
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists((prev) => {
            const updated = prev.filter((pl) => pl.id !== playlistId);
            localStorage.setItem('playlists', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <LibraryContext.Provider value={{ likedSongs, playlists, likedPlaylists, toggleLike, isLiked, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist, toggleLikePlaylist, isPlaylistLiked }}>
            {children}
        </LibraryContext.Provider>
    );
};