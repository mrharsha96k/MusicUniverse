import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaFire,
    FaMusic,
    FaMicrophone,
    FaCompactDisc,
    FaHeadphones,
} from "react-icons/fa";
import {
    getSongs,
    getArtists,
    getAlbums,
} from "../services/api";

import "../styles/Discover.css";

function Discover({
    playSong,
    currentSong,
    isPlaying,
}) {

    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);

    const [loading, setLoading] = useState(true);

    const [activeCategory, setActiveCategory] =
        useState("all");

    // =====================================================
    // LOAD DISCOVER DATA
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                const [
                    songsData,
                    artistsData,
                    albumsData,
                ] = await Promise.all([
                    getSongs(),
                    getArtists(),
                    getAlbums(),
                ]);

                const formattedSongs =
                    songsData.map((song) => ({
                        ...song,
                        image: song.coverUrl,
                        audio: song.songUrl,
                    }));

                setSongs(formattedSongs);
                setArtists(artistsData);
                setAlbums(albumsData);

            } catch (error) {

                console.error(
                    "Failed to load Discover:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    // =====================================================
    // PLAY SONG
    // =====================================================

    const handlePlaySong = (song) => {

        const index = songs.findIndex(
            (item) => item.id === song.id
        );

        playSong(
            song,
            index,
            songs
        );

    };

    // =====================================================
    // SLUG
    // =====================================================

    const createSlug = (value) => {

        return value
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

    };

    // =====================================================
    // TRENDING
    // =====================================================

    const trendingSongs = [...songs]
        .sort((a, b) => {

            const dateA =
                a.createdAt?._seconds || 0;

            const dateB =
                b.createdAt?._seconds || 0;

            return dateB - dateA;

        })
        .slice(0, 5);

    // =====================================================
    // NEW RELEASES
    // =====================================================

    const newReleases = [...songs]
        .sort((a, b) => {

            const dateA =
                a.createdAt?._seconds || 0;

            const dateB =
                b.createdAt?._seconds || 0;

            return dateB - dateA;

        })
        .slice(0, 6);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="discover-page">

                <div className="discover-loading">

                    <div className="loading-spinner" />

                    <h2>
                        Discovering music...
                    </h2>

                </div>

            </div>

        );

    }

    return (

        <div className="discover-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="discover-header">

                <div>

                    <span className="discover-eyebrow">
                        MUSICUNIVERSE
                    </span>

                    <h1>
                        Discover
                    </h1>

                    <p>
                        Find your next favorite song.
                    </p>

                </div>

            </section>


            {/* =================================================
                CATEGORY FILTERS
            ================================================= */}

            <div className="discover-filters">

                {[
                    ["all", "All"],
                    ["trending", "Trending"],
                    ["new", "New Releases"],
                    ["artists", "Artists"],
                    ["albums", "Albums"],
                ].map(([id, label]) => (

                    <button
                        key={id}
                        className={
                            activeCategory === id
                                ? "discover-filter active"
                                : "discover-filter"
                        }
                        onClick={() =>
                            setActiveCategory(id)
                        }
                    >
                        {label}
                    </button>

                ))}

            </div>


            {/* =================================================
                TRENDING SONGS
            ================================================= */}

            {(activeCategory === "all" ||
                activeCategory === "trending") && (

                <section className="discover-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-kicker">
                                <FaFire />
                            </span>

                            <h2>
                                Trending Songs
                            </h2>

                        </div>

                        <span className="section-count">
                            {trendingSongs.length} songs
                        </span>

                    </div>


                    <div className="trending-grid">

                        {trendingSongs.map(
                            (song) => (

                                <div
                                    className="trending-card"
                                    key={song.id}
                                    onClick={() => handlePlaySong(song)}
                                >

                                    <div className="song-image-wrapper">

                                        <img
                                            src={song.image}
                                            alt={song.title}
                                        />


                                    </div>

                                    <h3>
                                        {song.title}
                                    </h3>

                                    <p>
                                        {song.artist}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                NEW RELEASES
            ================================================= */}

            {(activeCategory === "all" ||
                activeCategory === "new") && (

                <section className="discover-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-kicker">
                                <FaMusic />
                            </span>

                            <h2>
                                New Releases
                            </h2>

                        </div>

                    </div>


                    <div className="release-list">

                        {newReleases.map(
                            (song, index) => (

                                <div
                                    className={
                                        currentSong?.id === song.id
                                        ? "release-row playing"
                                        : "release-row"
                                    }
                                    key={song.id}
                                    onClick={() => handlePlaySong(song)}
                                >

                                    <span className="release-number">
                                        {index + 1}
                                    </span>


                                    <img
                                        src={song.image}
                                        alt={song.title}
                                    />


                                    <div className="release-info">

                                        <strong>
                                            {song.title}
                                        </strong>

                                        <span>
                                            {song.artist}
                                        </span>

                                    </div>


                                    <span className="release-album">
                                        {song.album || "Single"}
                                    </span>


                                    <span className="release-duration">
                                        {song.duration || "--:--"}
                                    </span>


                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                POPULAR ARTISTS
            ================================================= */}

            {(activeCategory === "all" ||
                activeCategory === "artists") && (

                <section className="discover-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-kicker">
                                <FaMicrophone />
                            </span>

                            <h2>
                                Popular Artists
                            </h2>

                        </div>

                        <span className="section-count">
                            {artists.length} artists
                        </span>

                    </div>


                    <div className="artists-grid">

                        {artists
                            .slice(0, 8)
                            .map((artist) => (

                                <Link
                                    key={artist.id}
                                    to={`/artist/${createSlug(
                                        artist.name
                                    )}`}
                                    className="discover-artist"
                                >

                                    <div className="artist-image">

                                        <img
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                        />

                                    </div>

                                    <h3>
                                        {artist.name}
                                    </h3>

                                    <p>
                                        Artist
                                    </p>

                                </Link>

                            ))}

                    </div>

                </section>

            )}


            {/* =================================================
                ALBUMS
            ================================================= */}

            {(activeCategory === "all" ||
                activeCategory === "albums") && (

                <section className="discover-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-kicker">
                                <FaCompactDisc />
                            </span>

                            <h2>
                                Albums
                            </h2>

                        </div>

                        <span className="section-count">
                            {albums.length} albums
                        </span>

                    </div>


                    <div className="albums-grid">

                        {albums.map((album) => (

                            <Link
                                key={album.id}
                                to={`/album/${createSlug(
                                    album.name
                                )}`}
                                className="discover-album"
                            >

                                <div className="album-image">

                                    <img
                                        src={album.imageUrl}
                                        alt={album.name}
                                    />

                                </div>

                                <h3>
                                    {album.name}
                                </h3>

                                <p>
                                    {album.artist}
                                </p>

                            </Link>

                        ))}

                    </div>

                </section>

            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {songs.length === 0 && (

                <div className="discover-empty">

                    <div>
                        <FaHeadphones />
                    </div>

                    <h2>
                        No music yet
                    </h2>

                    <p>
                        Upload some songs from the
                        admin panel to start discovering.
                    </p>

                </div>

            )}

        </div>

    );

}

export default Discover;