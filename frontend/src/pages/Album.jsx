import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FaCompactDisc,
    FaPlay,
    FaRandom
} from "react-icons/fa";
import { getSongs, getAlbums } from "../services/api";
import SongRow from "../components/SongRow";
import "../styles/Artist.css";

function Album({
    playSong,
    currentSong,
    isPlaying,
    handlePlayPause,
}) {

    const { name } = useParams();

    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD SONGS + ALBUMS
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                const [songsData, albumsData] = await Promise.all([
                    getSongs(),
                    getAlbums(),
                ]);

                const formattedSongs = songsData.map((song) => ({
                    ...song,
                    image: song.coverUrl,
                    audio: song.songUrl,
                }));

                setSongs(formattedSongs);
                setAlbums(albumsData);

            } catch (error) {

                console.error(
                    "Failed to load album:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <h1 style={{ color: "white" }}>
                Loading Album...
            </h1>
        );
    }

    // =====================================================
    // GET ALBUM NAME FROM URL
    // =====================================================

    const albumName = decodeURIComponent(name || "")
        .replace(/-/g, " ")
        .trim();

    // =====================================================
    // FIND SONGS FOR THIS ALBUM
    // =====================================================

    const albumSongs = songs.filter(
        (song) =>
            song.album?.toLowerCase() ===
            albumName.toLowerCase()
    );

    // =====================================================
    // FIND REAL ALBUM FROM DATABASE
    // =====================================================

    const albumData = albums.find(
        (album) =>
            album.name?.toLowerCase() ===
            albumName.toLowerCase()
    );

    // =====================================================
    // ALBUM NOT FOUND
    // =====================================================

    if (!albumData || albumSongs.length === 0) {

        return (
            <h1 style={{ color: "white" }}>
                Album Not Found
            </h1>
        );

    }

    // =====================================================
    // REAL ALBUM IMAGE
    // =====================================================

    const albumImage = albumData.imageUrl;

    // =====================================================
    // PLAY ALL
    // =====================================================

    const handlePlayAll = () => {

        if (albumSongs.length === 0) {
            return;
        }

        playSong(
            albumSongs[0],
            0,
            albumSongs
        );

    };

    // =====================================================
    // SHUFFLE
    // =====================================================

    const handleShuffle = () => {

        if (albumSongs.length === 0) {
            return;
        }

        const randomIndex = Math.floor(
            Math.random() * albumSongs.length
        );

        playSong(
            albumSongs[randomIndex],
            randomIndex,
            albumSongs
        );

    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="artist-page album-page">

            {/* =================================================
                ALBUM HEADER
            ================================================= */}

            <div
                className="artist-header"
                style={{
                    backgroundImage:
                        `linear-gradient(
                            rgba(0,0,0,.45),
                            rgba(15,23,42,.95)
                        ),
                        url(${albumImage})`,
                }}
            >

                {/* ALBUM IMAGE */}

                <img
                    src={albumImage}
                    alt={albumData.name}
                    className="artist-cover"
                />

                {/* ALBUM INFORMATION */}

                <div>

                    <div className="artist-info">

                        <span className="verified album-label">
                            <FaCompactDisc />
                            Album
                        </span>
                        <h1>
                            {albumData.name}
                        </h1>

                        <p>
                            {albumData.artist}
                        </p>

                    </div>

                    {/* BUTTONS */}

                    <div className="artist-actions">

                        <button
                            className="play-all-btn"
                            onClick={handlePlayAll}
                        >
                            <FaPlay />
                            Play
                        </button>

                        <button
                            className="shuffle-btn"
                            onClick={handleShuffle}
                        >
                            <FaRandom />
                            Shuffle
                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
                TRACKS
            ================================================= */}

            <h2>
                Tracks
            </h2>

            <div className="featured-song-list">

                {albumSongs.map((song, index) => (

                    <SongRow
                        key={song.id}
                        song={song}
                        index={index}
                        songsList={albumSongs}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        playSong={playSong}
                        handlePlayPause={handlePlayPause}
                        duration={song.duration}
                        currentTime={0}
                    />

                ))}

            </div>

        </div>

    );
}

export default Album;