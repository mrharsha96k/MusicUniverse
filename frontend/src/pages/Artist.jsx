import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/Artist.css";
import {
    FaCheckCircle,
    FaPlay,
    FaRandom,
    FaHeart,
    FaRegHeart
} from "react-icons/fa";

import SongRow from "../components/SongRow";
import { getSongs, getArtists } from "../services/api";

function Artist({
    playSong,
    currentSong,
    isPlaying,
    handlePlayPause,
}) {
    const { name } = useParams();

    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);

    // =====================================================
    // GET ARTIST NAME FROM URL
    // =====================================================

    const artistName = decodeURIComponent(name || "")
        .replace(/-/g, " ")
        .trim();

    // =====================================================
    // DISPLAY NAME
    // =====================================================

    const displayName =
        artistName.toLowerCase() === "kk"
            ? "KK"
            : artistName
                .split(" ")
                .filter(Boolean)
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1)
                )
                .join(" ");

    // =====================================================
    // FOLLOW STATE
    // =====================================================

    useEffect(() => {
        const saved = localStorage.getItem(
            `followed_${artistName.toLowerCase()}`
        );

        setFollowing(saved === "true");
    }, [artistName]);

    useEffect(() => {
        localStorage.setItem(
            `followed_${artistName.toLowerCase()}`,
            following
        );
    }, [following, artistName]);

    // =====================================================
    // LOAD SONGS + ARTISTS
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [songsData, artistsData] =
                    await Promise.all([
                        getSongs(),
                        getArtists(),
                    ]);

                // Format songs
                const formattedSongs = songsData.map(
                    (song) => ({
                        ...song,

                        image: song.coverUrl,
                        audio: song.songUrl,
                    })
                );

                setSongs(formattedSongs);

                // Save artists
                setArtists(artistsData);

            } catch (error) {
                console.error(
                    "Failed to load artist data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // =====================================================
    // FIND SONGS BELONGING TO THIS ARTIST
    // =====================================================

    const artistSongs = songs.filter((song) => {
        if (!song.artist) {
            return false;
        }

        const songArtists = song.artist
            .split(/[,/]/)
            .map((artist) =>
                artist.trim().toLowerCase()
            )
            .filter(Boolean);

        return songArtists.includes(
            artistName.toLowerCase()
        );
    });

    // =====================================================
    // FIND REAL ARTIST IMAGE
    // =====================================================

    const artistData = artists.find(
        (artist) =>
            artist.name?.trim().toLowerCase() ===
            artistName.toLowerCase()
    );

    const artistImage = artistData?.imageUrl;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="artist-page">
                <h1>Loading Artist...</h1>
            </div>
        );
    }

    // =====================================================
    // ARTIST NOT FOUND
    // =====================================================

    if (artistSongs.length === 0) {
        return (
            <div className="artist-page">
                <h1>Artist Not Found</h1>

                <p>
                    No songs were found for "{displayName}".
                </p>
            </div>
        );
    }

    // =====================================================
    // PLAY ALL
    // =====================================================

    const handlePlayAll = () => {
        if (artistSongs.length === 0) {
            return;
        }

        playSong(
            artistSongs[0],
            0,
            artistSongs
        );
    };

    // =====================================================
    // SHUFFLE
    // =====================================================

    const handleShuffle = () => {
        if (artistSongs.length === 0) {
            return;
        }

        const randomIndex = Math.floor(
            Math.random() * artistSongs.length
        );

        playSong(
            artistSongs[randomIndex],
            randomIndex,
            artistSongs
        );
    };

    // =====================================================
    // FOLLOW
    // =====================================================

    const handleFollow = () => {
        setFollowing((prev) => !prev);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="artist-page">

            {/* =================================================
                ARTIST HEADER
            ================================================= */}

            <div
                className="artist-header"
                style={{
                    backgroundImage: artistImage
                        ? `
                            linear-gradient(
                                rgba(0,0,0,.45),
                                rgba(15,23,42,.95)
                            ),
                            url(${artistImage})
                          `
                        : "none",
                }}
            >

                {/* ARTIST IMAGE */}

                <img
                    src={artistImage}
                    alt={displayName}
                    className="artist-cover"
                />

                {/* ARTIST INFORMATION */}

                <div>

                    <div className="artist-info">

                        <span className="verified">
                            <FaCheckCircle />
                            Verified Artist
                        </span>

                        <h1>
                            {displayName}
                        </h1>

                        <p>
                            {artistSongs.length} Songs
                        </p>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="artist-actions">

                        {/* PLAY ALL */}

                        <button
                            className="play-all-btn"
                            onClick={handlePlayAll}
                        >
                            <FaPlay />
                            Play All
                        </button>

                        {/* SHUFFLE */}

                        <button
                            className="shuffle-btn"
                            onClick={handleShuffle}
                        >
                            <FaRandom />
                            Shuffle
                        </button>

                        {/* FOLLOW */}

                        <button
                            className={`follow-btn ${
                                following ? "following" : ""
                            }`}
                            onClick={handleFollow}
                        >
                            {following ? <FaHeart /> : <FaRegHeart />}

                            {following ? "Following" : "Follow"}
                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
                SONGS
            ================================================= */}

            <h2>
                Popular Songs
            </h2>

            <div className="featured-song-list">

                {artistSongs.map((song, index) => (

                    <SongRow
                        key={song.id}
                        song={song}
                        index={index}
                        songsList={artistSongs}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        playSong={playSong}
                        handlePlayPause={
                            handlePlayPause
                        }
                        duration={song.duration}
                        currentTime={0}
                    />

                ))}

            </div>

        </div>
    );
}

export default Artist;