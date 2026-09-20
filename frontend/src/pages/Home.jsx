import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHistory,
    FaPlay,
    FaArrowRight,
    FaMusic,
    FaMicrophone,
    FaCompactDisc,
    FaHeadphones,
} from "react-icons/fa";

import "../styles/Home.css";
import "../styles/SongCard.css";

import SongCard from "../components/SongCard";

import {
    getSongs,
    getArtists,
    getAlbums,
} from "../services/api";

import { useSearch } from "../context/SearchContext";


function Home({

    currentSong,
    setCurrentSong,
    setCurrentArtist,
    setCurrentImage,
    setCurrentAudio,

    audioRef,
    isPlaying,
    setIsPlaying,

    playSong,

    recentlyPlayed,

}) {

    const { searchTerm } = useSearch();

    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [songList, setSongList] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);

    const [loading, setLoading] = useState(true);

    const [genreFilter, setGenreFilter] = useState(null);

    const [showAllRecent, setShowAllRecent] = useState(false);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    songsData,
                    artistsData,
                    albumsData,
                ] = await Promise.all([
                    getSongs(),
                    getArtists(),
                    getAlbums(),
                ]);


                // -------------------------------
                // FORMAT SONGS
                // -------------------------------

                const formattedSongs = songsData.map((song) => ({

                    ...song,

                    image: song.coverUrl,

                    audio: song.songUrl,

                }));


                setSongList(formattedSongs);


                // -------------------------------
                // ARTISTS
                // -------------------------------

                setArtists(artistsData || []);


                // -------------------------------
                // ALBUMS
                // -------------------------------

                setAlbums(albumsData || []);


            } catch (error) {

                console.error(
                    "Failed to load Home data:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // =========================================================
    // SEARCH
    // =========================================================

    const normalizedSearch = searchTerm
        .trim()
        .toLowerCase();


    // =========================================================
    // RECENTLY ADDED
    // =========================================================

    const recentlyAdded = [...songList]
        .sort((a, b) => {

            const dateA =
                a.createdAt?._seconds ||
                a.createdAt?.seconds ||
                0;

            const dateB =
                b.createdAt?._seconds ||
                b.createdAt?.seconds ||
                0;

            return dateB - dateA;

        })
        .slice(0, 10);


    // =========================================================
    // GENRES
    // =========================================================

    const genres = [
        ...new Set(
            songList
                .map((song) => song.genre)
                .filter(Boolean)
        ),
    ];


    // =========================================================
    // FILTERED SONGS
    // =========================================================

    const displayedSongs = (
        genreFilter
            ? songList.filter(
                (song) =>
                    song.genre === genreFilter
            )
            : recentlyAdded
    ).filter((song) => {

        if (!normalizedSearch) {
            return true;
        }

        return (
            song.title
                ?.toLowerCase()
                .includes(normalizedSearch) ||

            song.artist
                ?.toLowerCase()
                .includes(normalizedSearch) ||

            song.album
                ?.toLowerCase()
                .includes(normalizedSearch)
        );

    });


    // =========================================================
    // HERO ARTWORK
    // =========================================================

    const heroArt = recentlyAdded.slice(0, 3);


    // =========================================================
    // CURRENT SONG TITLE
    // =========================================================

    const currentSongTitle =
        typeof currentSong === "object"
            ? currentSong?.title
            : currentSong;


    // =========================================================
    // PLAY / PAUSE
    // =========================================================

    const handlePlayPause = () => {

        if (!audioRef?.current) {
            return;
        }


        if (isPlaying) {

            audioRef.current.pause();

            setIsPlaying(false);

        } else {

            audioRef.current
                .play()
                .then(() => {

                    setIsPlaying(true);

                })
                .catch((error) => {

                    console.error(
                        "Unable to play audio:",
                        error
                    );

                });

        }

    };


    // =========================================================
    // START LISTENING
    // =========================================================

    const goToRecentlyAdded = () => {

        const target =
            document.getElementById(
                "recently-added"
            );


        if (target) {

            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

        }

    };


    // =========================================================
    // PLAY HERO SONG
    // =========================================================

    const handleHeroPlay = () => {
        if (!recentlyAdded.length) {
            return;
        }

        playSong(
            recentlyAdded[0],
            0,
            recentlyAdded
        );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="home-loading">

                <div className="loading-spinner" />

                <p>
                    Loading MusicUniverse...
                </p>

            </div>

        );

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="home-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="hero">

                <div
                    className="hero-background"
                    aria-hidden="true"
                />

                <div
                    className="hero-grid"
                    aria-hidden="true"
                />


                <div className="hero-inner">


                    {/* HERO TEXT */}

                    <div className="hero-copy">

                        <span className="hero-eyebrow">
                            MUSICUNIVERSE
                        </span>


                        <h1>

                            Your music.

                            <br />

                            <span>
                                Your universe.
                            </span>

                        </h1>


                        <p className="hero-sub">

                            Discover new sounds, revisit
                            your favorites, and let the
                            music play.

                        </p>


                        {/* STATS */}

                        <div className="hero-stats">


                            <div className="hero-stat">

                                <FaMusic />

                                <div>

                                    <strong>
                                        {songList.length}
                                    </strong>

                                    <span>
                                        Songs
                                    </span>

                                </div>

                            </div>


                            <div className="hero-stat-divider" />


                            <div className="hero-stat">

                                <FaMicrophone />

                                <div>

                                    <strong>
                                        {artists.length}
                                    </strong>

                                    <span>
                                        Artists
                                    </span>

                                </div>

                            </div>


                            <div className="hero-stat-divider" />


                            <div className="hero-stat">

                                <FaCompactDisc />

                                <div>

                                    <strong>
                                        {albums.length}
                                    </strong>

                                    <span>
                                        Albums
                                    </span>

                                </div>

                            </div>


                        </div>


                        {/* NOW PLAYING */}

                        <p className="hero-now-playing">

                            {currentSongTitle ? (

                                <>
                                    <span>
                                        Now playing
                                    </span>

                                    <strong>
                                        {currentSongTitle}
                                    </strong>
                                </>

                            ) : (

                                <>
                                    <span>
                                        Ready when you are
                                    </span>

                                    <strong>
                                        Pick a song and start listening.
                                    </strong>
                                </>

                            )}

                        </p>


                        {/* HERO BUTTON */}

                        <div className="hero-actions">

                            <button
                                className="hero-btn"
                                onClick={handleHeroPlay}
                            >

                                <FaPlay />

                                Start Listening

                            </button>


                            <button
                                className="hero-secondary-btn"
                                onClick={goToRecentlyAdded}
                            >

                                Explore Music

                                <FaArrowRight />

                            </button>

                        </div>

                    </div>


                    {/* HERO ART */}

                    {heroArt.length > 0 && (

                        <div
                            className="hero-art-stack"
                            aria-hidden="true"
                        >

                            <div className="hero-orbit orbit-one" />
                            <div className="hero-orbit orbit-two" />


                            {heroArt.map(
                                (song, index) => (

                                    <div
                                        className={`hero-art-card hero-art-card-${index}`}
                                        key={song.id}
                                    >

                                        <img
                                            src={song.image}
                                            alt=""
                                        />


                                        <div className="hero-art-shine" />

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
                RECENTLY PLAYED
            ================================================= */}

            {recentlyPlayed?.length > 0 && (

                <section className="home-section recently-played-section">

                    <div className="section-header">

                        <div>

                            <span className="section-kicker">
                                YOUR MUSIC
                            </span>

                            <h2 className="section-title">

                                <FaHistory />

                                Recently Played

                            </h2>

                        </div>


                        <button
                            className="section-link"
                            onClick={() =>
                                setShowAllRecent(
                                    !showAllRecent
                                )
                            }
                        >

                            {showAllRecent
                                ? "Show less"
                                : "See all"
                            }

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="song-row">

                        {recentlyPlayed
                            .slice(
                                0,
                                showAllRecent ? 10 : 5
                            )
                            .map((song) => (

                                <SongCard

                                    key={song.id}

                                    songId={song.id}

                                    title={song.title}

                                    artist={song.artist}

                                    image={
                                        song.image ||
                                        song.coverUrl
                                    }

                                    audio={
                                        song.audio ||
                                        song.songUrl
                                    }

                                    duration={song.duration}

                                    genre={song.genre}

                                    year={song.year}

                                    currentSong={
                                        currentSong
                                    }

                                    isPlaying={
                                        isPlaying
                                    }

                                    setCurrentSong={
                                        setCurrentSong
                                    }

                                    setCurrentArtist={
                                        setCurrentArtist
                                    }

                                    setCurrentImage={
                                        setCurrentImage
                                    }

                                    setCurrentAudio={
                                        setCurrentAudio
                                    }

                                    playSong={
                                        playSong
                                    }

                                    handlePlayPause={
                                        handlePlayPause
                                    }

                                />

                            ))}

                    </div>

                </section>

            )}


            {/* =================================================
                RECENTLY ADDED
            ================================================= */}

            <section
                className="home-section"
                id="recently-added"
            >

                <div className="section-header">

                    <div>

                        <span className="section-kicker">
                            FRESH FROM THE UNIVERSE
                        </span>

                        <h2 className="section-title">
                            {genreFilter
                                ? `${genreFilter} Songs`
                                : "Recently Added"
                            }
                        </h2>

                    </div>


                    {genreFilter && (

                        <button
                            className="clear-filter-btn"
                            onClick={() =>
                                setGenreFilter(null)
                            }
                        >

                            Clear filter

                        </button>

                    )}

                </div>


                {displayedSongs.length > 0 ? (

                    <div className="song-row">

                        {displayedSongs.map(
                            (song) => (

                                <SongCard

                                    key={song.id}

                                    songId={song.id}

                                    title={song.title}

                                    artist={song.artist}

                                    image={song.image}

                                    audio={song.audio}

                                    duration={
                                        song.duration
                                    }

                                    genre={song.genre}

                                    year={song.year}

                                    currentSong={
                                        currentSong
                                    }

                                    isPlaying={
                                        isPlaying
                                    }

                                    setCurrentSong={
                                        setCurrentSong
                                    }

                                    setCurrentArtist={
                                        setCurrentArtist
                                    }

                                    setCurrentImage={
                                        setCurrentImage
                                    }

                                    setCurrentAudio={
                                        setCurrentAudio
                                    }

                                    playSong={
                                        playSong
                                    }

                                    handlePlayPause={
                                        handlePlayPause
                                    }

                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="empty-state">

                        <FaMusic />

                        <h3>
                            No songs found
                        </h3>

                        <p>
                            Try another search or
                            clear the current filter.
                        </p>

                    </div>

                )}

            </section>


            {/* =================================================
                BROWSE BY GENRE
            ================================================= */}

            {genres.length > 0 && (

                <section className="home-section">

                    <div className="section-header">

                        <div>

                            <span className="section-kicker">
                                FIND YOUR VIBE
                            </span>

                            <h2 className="section-title">
                                Browse by Genre
                            </h2>

                        </div>

                    </div>


                    <div className="genre-grid">

                        {genres.map(
                            (genre, index) => (

                                <button

                                    key={genre}

                                    className={`genre-tile genre-tile-${index % 5} ${
                                        genreFilter === genre
                                            ? "genre-tile-active"
                                            : ""
                                    }`}

                                    onClick={() => {

                                        setGenreFilter(
                                            genreFilter === genre
                                                ? null
                                                : genre
                                        );

                                        setTimeout(
                                            goToRecentlyAdded,
                                            50
                                        );

                                    }}

                                >

                                    <FaHeadphones />

                                    <span>
                                        {genre}
                                    </span>

                                    <FaArrowRight />

                                </button>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                LATEST ARTISTS
            ================================================= */}

            {artists.length > 0 && (
                <section className="home-section">

                    <div className="section-header">

                        <div>

                            <span className="section-kicker">
                                MEET THE VOICES
                            </span>

                            <h2 className="section-title">
                                Latest Artists
                            </h2>

                        </div>

                        <span className="section-count">
                            {Math.min(artists.length, 5)} artists
                        </span>

                    </div>


                    <div className="artist-row">

                        {[...artists]
                            .sort((a, b) => {

                                const dateA =
                                    a.createdAt?._seconds ||
                                    a.createdAt?.seconds ||
                                    0;

                                const dateB =
                                    b.createdAt?._seconds ||
                                    b.createdAt?.seconds ||
                                    0;

                                return dateB - dateA;

                            })
                            .slice(0, 5)
                            .map((artist) => (

                                <div
                                    className="artist-card"
                                    key={artist.id}
                                    onClick={() => {
                                        navigate(
                                            `/artist/${artist.name
                                                .trim()
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`
                                        );
                                    }}
                                >

                                    <div className="artist-image-wrapper">

                                        <img
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                            className="artist-image"

                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                        <div className="artist-play">
                                            <FaPlay />
                                        </div>

                                    </div>


                                    <h3>
                                        {artist.name}
                                    </h3>

                                    <p>
                                        Artist
                                    </p>

                                </div>

                            ))}

                    </div>

                </section>
            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <strong>
                        MusicUniverse
                    </strong>

                    <span>
                        Your music. Your universe.
                    </span>

                </div>


                <div className="home-footer-links">

                    <span>
                        About
                    </span>

                    <span>
                        Privacy
                    </span>

                    <span>
                        Terms
                    </span>

                </div>


                <span className="footer-copy">
                    © {new Date().getFullYear()} MusicUniverse
                    <span className="footer-creator">
                        Created by Harshad Kiran More
                    </span>
                </span>


            </footer>


        </div>

    );

}


export default Home;