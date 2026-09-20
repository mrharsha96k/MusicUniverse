import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSongs, getArtists, getAlbums } from "../services/api";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../services/firebase";
import "../styles/Library.css";
import "../styles/ArtistBox.css"
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaTrash,
  FaEdit,
  FaMusic,
  FaMicrophone,
  FaCompactDisc,
  FaFolder,
  FaFolderOpen,
  FaCheckCircle,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";



function Library({
  currentSong,
  playSong,
  isPlaying,
  handlePlayPause,
  currentTime,
  favorites,
  setFavorites,
  currentUser,
  recentlyPlayed,
}) {

  const navigate = useNavigate();
  const location = useLocation();
  
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  


  const [activeSection, setActiveSection] = useState("songs");
  

  
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState([]);
  // ==========================================
  // LOAD PLAYLISTS FROM FIRESTORE
  // ==========================================

  useEffect(() => {
    const loadPlaylists = async () => {
      if (!currentUser?.uid) {
        setPlaylists([]);
        return;
      }

      try {
        const playlistsRef = collection(
          db,
          "users",
          currentUser.uid,
          "playlists"
        );

        const snapshot = await getDocs(playlistsRef);

        const loadedPlaylists = snapshot.docs.map((playlistDoc) => ({
          id: Number(playlistDoc.id),
          ...playlistDoc.data(),
        }));

        setPlaylists(loadedPlaylists);

      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    };

    loadPlaylists();
  }, [currentUser]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showSongModal, setShowSongModal] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [editedPlaylistName, setEditedPlaylistName] = useState("");
  useEffect(() => {

    const path = location.pathname;

    // All Songs
    // Library Overview
    if (path === "/library") {
      setActiveSection("overview");
      setSelectedPlaylist(null);
      return;
    }

    // All Songs
    if (path === "/library/songs") {
      setActiveSection("songs");
      setSelectedPlaylist(null);
      return;
    }

    // Favorites
    if (path === "/library/favorites") {
      setActiveSection("favorites");
      setSelectedPlaylist(null);
      return;
    }

    // Albums
    if (path === "/library/albums") {
      setActiveSection("albums");
      setSelectedPlaylist(null);
      return;
    }

    // Artists
    if (path === "/library/artists") {
      setActiveSection("artists");
      setSelectedPlaylist(null);
      return;
    }

    // Playlist list
    if (path === "/library/playlists") {
      setActiveSection("playlists");
      setSelectedPlaylist(null);
      return;
    }

    // Individual playlist
    if (path.startsWith("/library/playlists/")) {

      const playlistId = Number(
        path.split("/").pop()
      );

      const playlist = playlists.find(
        (p) => p.id === playlistId
      );

      if (playlist) {
        setSelectedPlaylist(playlist);
        setActiveSection("playlistDetails");
      } else {
        setSelectedPlaylist(null);
        setActiveSection("playlists");
        navigate("/library/playlists");
      }

      return;
    }

    // Fallback
    setSelectedPlaylist(null);
    setActiveSection("songs");

  }, [location.pathname, playlists, navigate]);

  const [followedArtists, setFollowedArtists] = useState(() => {
    const saved = localStorage.getItem("followedArtists");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [songDurations, setSongDurations] = useState({});
  
  useEffect(() => {
    songs.forEach((song) => {
      const audio = new Audio(song.audio);

      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);

        const formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

        setSongDurations((prev) => ({
          ...prev,
          [song.id]: formatted,
        }));
      });
    });
  }, [songs]);

  useEffect(() => {
    localStorage.setItem(
      "followedArtists",
      JSON.stringify(followedArtists)
    );
  }, [followedArtists]);
  

  
  const favoriteSongs = songs.filter(
    (song) =>
      song.title &&
    favorites.includes(song.title)
  );
  
  

 
  
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();

        const formattedSongs = data.map((song) => ({
          ...song,
          image: song.coverUrl,
          audio: song.songUrl,
        }));

        setSongs(formattedSongs);

      } catch (error) {
        console.error("Failed to load songs:", error);
      }
    };

    loadSongs();
  }, []);
  // ==========================================
  // LOAD ARTISTS FROM BACKEND
  // ==========================================

  useEffect(() => {
      const loadArtists = async () => {
          try {
              const data = await getArtists();

              setArtists(data);

          } catch (error) {
              console.error(
                  "Failed to load artists:",
                  error
              );
          }
      };

      loadArtists();
  }, []);

  // ==========================================
  // LOAD ALBUMS FROM BACKEND
  // ==========================================

  useEffect(() => {
      const loadAlbums = async () => {
          try {
              const data = await getAlbums();

              setAlbums(data);

          } catch (error) {
              console.error(
                  "Failed to load albums:",
                  error
              );
          }
      };

      loadAlbums();
  }, []);


    const librarySectionNav = (
    <div className="library-section-nav">

      <div
        className={`section-nav-card ${activeSection === "songs" ? "active" : ""}`}
        onClick={() => navigate("/library/songs")}
      >
        <FaMusic />
        <span>All Songs</span>
      </div>

      <div
        className={`section-nav-card ${activeSection === "favorites" ? "active" : ""}`}
        onClick={() => navigate("/library/favorites")}
      >
        <FaHeart />
        <span>Favorites</span>
      </div>

      <div
        className={`section-nav-card ${activeSection === "artists" ? "active" : ""}`}
        onClick={() => navigate("/library/artists")}
      >
        <FaMicrophone />
        <span>Artists</span>
      </div>

      <div
        className={`section-nav-card ${activeSection === "albums" ? "active" : ""}`}
        onClick={() => navigate("/library/albums")}
      >
        <FaCompactDisc />
        <span>Albums</span>
      </div>

      <div
        className={`section-nav-card ${activeSection === "playlists" ? "active" : ""}`}
        onClick={() => navigate("/library/playlists")}
      >
        <FaFolder />
        <span>Playlists</span>
      </div>

    </div>
  );

  return (
  <div className="library-page">
    
      <div className="library-content">

        {activeSection === "overview" && (
          <div className="library-overview">

            <div className="overview-header">
              <div>
                <span className="overview-label">YOUR MUSIC SPACE</span>
                <h2>Welcome to Your Library</h2>
                <p>Everything you saved, followed, and created.</p>
              </div>
            </div>

            <div className="overview-stats">

              <div
                className="overview-stat-card"
                onClick={() => navigate("/library/songs")}
              >
                <div className="overview-stat-icon">
                  <FaMusic />
                </div>

                <div>
                  <span>ALL SONGS</span>
                  <strong>{songs.length}</strong>
                  <p>Songs in your library</p>
                </div>
              </div>

              <div
                className="overview-stat-card"
                onClick={() => navigate("/library/favorites")}
              >
                <div className="overview-stat-icon">
                  <FaHeart />
                </div>

                <div>
                  <span>FAVORITES</span>
                  <strong>{favorites.length}</strong>
                  <p>Liked songs</p>
                </div>
              </div>

              <div
                className="overview-stat-card"
                onClick={() => navigate("/library/artists")}
              >
                <div className="overview-stat-icon">
                  <FaMicrophone />
                </div>

                <div>
                  <span>ARTISTS</span>
                  <strong>{artists.length}</strong>
                  <p>Artists in your library</p>
                </div>
              </div>

              <div
                className="overview-stat-card"
                onClick={() => navigate("/library/albums")}
              >
                <div className="overview-stat-icon">
                  <FaCompactDisc />
                </div>

                <div>
                  <span>ALBUMS</span>
                  <strong>{albums.length}</strong>
                  <p>Albums in your library</p>
                </div>
              </div>

              <div
                className="overview-stat-card"
                onClick={() => navigate("/library/playlists")}
              >
                <div className="overview-stat-icon">
                  <FaFolder />
                </div>

                <div>
                  <span>PLAYLISTS</span>
                  <strong>{playlists.length}</strong>
                  <p>Your personal playlists</p>
                </div>
              </div>

            </div>

            <div className="overview-recent">

              <div className="overview-section-header">
                <div>
                  <span className="overview-label">YOUR HISTORY</span>
                  <h3>Recently Played</h3>
                </div>

                <button
                  onClick={() => navigate("/library/songs")}
                >
                  View All
                </button>
              </div>

              {recentlyPlayed.length > 0 ? (
                <div className="recently-played-list">

                  {recentlyPlayed.slice(0, 5).map((song, index) => (

                    <div
                      key={song.id || index}
                      className="recently-played-item"
                      onClick={() => playSong(song, index, recentlyPlayed)}
                    >

                      <div className="recently-played-left">

                        <span className="recent-number">
                          {index + 1}
                        </span>

                        <img
                          src={song.image}
                          alt={song.title}
                        />

                        <div>
                          <h4>{song.title}</h4>
                          <p>{song.artist}</p>
                        </div>

                      </div>

                      <button
                        className="recent-play-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(song, index, recentlyPlayed);
                        }}
                      >
                        <FaPlay />
                      </button>

                    </div>

                  ))}

                </div>
              ) : (
                <div className="recent-empty">
                  <FaMusic />
                  <p>No recently played songs yet.</p>
                </div>
              )}

            </div>

            <div className="overview-recent">

              <div className="overview-section-header">
                <div>
                  <span className="overview-label">FRESH FROM THE LIBRARY</span>
                  <h3>Recently Added</h3>
                </div>

                <button
                  onClick={() => navigate("/library/songs")}
                >
                  View All
                </button>
              </div>

              <div className="recently-played-list">

                {songs.slice(-5).reverse().map((song, index) => (

                  <div
                    key={song.id}
                    className="recently-played-item"
                    onClick={() => {
                      playSong(song, song.id - 1, songs);
                    }}
                  >

                    <div className="recently-played-left">

                      <span className="recent-number">
                        {index + 1}
                      </span>

                      <img
                        src={song.image}
                        alt={song.title}
                      />

                      <div>
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                      </div>

                    </div>

                    <button
                      className="recent-play-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSong(song, song.id - 1, songs);
                      }}
                    >
                      <FaPlay />
                    </button>

                  </div>

                ))}

              </div>

            </div>

            <div className="overview-artists">

              <div className="overview-section-header">
                <div>
                  <span className="overview-label">YOUR ARTISTS</span>
                  <h3>Artists</h3>
                </div>

                <button
                  onClick={() => navigate("/library/artists")}
                >
                  View All
                </button>
              </div>

              <div className="overview-artist-list">

                {artists.slice(0, 5).map((artist) => {

                  const artistSongs = songs.filter((song) => {
                    if (!song.artist) return false;

                    const songArtists = song.artist
                      .split(/[,/]/)
                      .map((name) => name.trim().toLowerCase())
                      .filter(Boolean);

                    return songArtists.includes(
                      artist.name.trim().toLowerCase()
                    );
                  });

                  return (
                    <div
                      key={artist.id}
                      className="overview-artist-card"
                      onClick={() => {
                        navigate(
                          `/artist/${artist.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        );
                      }}
                    >

                      <img
                        src={artist.imageUrl}
                        alt={artist.name}
                      />

                      <div className="overview-artist-info">
                        <h4>{artist.name}</h4>
                        <p>{artistSongs.length} Songs</p>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <div className="overview-albums">

              <div className="overview-section-header">
                <div>
                  <span className="overview-label">YOUR COLLECTION</span>
                  <h3>Albums</h3>
                </div>

                <button
                  onClick={() => navigate("/library/albums")}
                >
                  View All
                </button>
              </div>

              <div className="overview-album-list">

                {albums.slice(0, 5).map((album) => (

                  <div
                    key={album.id}
                    className="overview-album-card"
                    onClick={() => {
                      navigate(
                        `/album/${album.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      );
                    }}
                  >

                    <img
                      src={album.imageUrl}
                      alt={album.name}
                    />

                    <div className="overview-album-info">
                      <h4>{album.name}</h4>
                      <p>{album.artist}</p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="overview-playlists">

              <div className="overview-section-header">
                <div>
                  <span className="overview-label">YOUR CREATIONS</span>
                  <h3>Playlists</h3>
                </div>

                <button
                  onClick={() => navigate("/library/playlists")}
                >
                  View All
                </button>
              </div>

              <div className="overview-playlist-list">

                {playlists.length > 0 ? (

                  playlists.slice(0, 4).map((playlist) => (

                    <div
                      key={playlist.id}
                      className="overview-playlist-card"
                      onClick={() => {
                        navigate(`/library/playlists/${playlist.id}`);
                      }}
                    >

                      <div className="overview-playlist-cover">

                        {playlist.songs.length > 0 ? (

                          <img
                            src={playlist.songs[0].image}
                            alt={playlist.name}
                          />

                        ) : (

                          <FaFolderOpen />

                        )}

                      </div>

                      <div className="overview-playlist-info">

                        <h4>{playlist.name}</h4>

                        <p>
                          {playlist.songs.length} Songs
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="playlist-empty">
                    <FaFolderOpen />
                    <p>No playlists created yet.</p>
                  </div>

                )}

              </div>

            </div>

          </div>
        )}

        {activeSection === "songs" && (
        <>
          <div className="songs-page-header">
            <div>
              <span className="overview-label">YOUR MUSIC</span>
              <h2>All Songs</h2>
              <p>{songs.length} songs in your library</p>
            </div>

            <button
              className="songs-play-all-btn"
              onClick={() => {
                if (songs.length > 0) {
                  playSong(songs[0], 0, songs);
                }
              }}
            >
              <FaPlay />
              <span>Play All</span>
            </button>
          </div>

          <div className="songs-list-header">
            <span>#</span>
            <span>Title</span>
            <span>Time</span>
          </div>

          {songs.map((song) => (
              <div
                key={song.id}
                className={`library-song ${
                  currentSong === song.title ? "active" : ""
                }`}
                onClick={() => {
                  if (currentSong === song.title) {
                    handlePlayPause();
                  } else {
                    playSong(song, song.id - 1, songs);
                  }
                }}
              >

                <div className="library-song-left">

                  <img
                    src={song.image}
                    alt={song.title}
                  />

                  <div className="library-song-info">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>

                </div>

                <div className="library-song-right">

                  <button
                    className={`library-play-btn ${
                      currentSong === song.title && isPlaying ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (currentSong === song.title) {
                        handlePlayPause();
                      } else {
                        playSong(song, song.id - 1, songs);
                      }
                    }}
                  >
                    {currentSong === song.title && isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )}
                  </button>

                  <span>
                    {currentSong === song.title
                      ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, "0")} / ${songDurations[song.id] || "--:--"}`
                      : songDurations[song.id] || "--:--"}
                  </span>

                </div>

              </div>
            ))}
            {librarySectionNav}
          </>
        )}


{/* -----------------------------------------Favorite sections---------------------------------------------------------------------- */}

        {activeSection === "favorites" && (
          <>
            <div className="songs-page-header">
              <div>
                <span className="overview-label">YOUR MUSIC</span>
                <h2>Favorite Songs</h2>
                <p>{favoriteSongs.length} songs in your favorites</p>
              </div>
            </div>

            {favoriteSongs.length > 0 ? (
              favoriteSongs.map((song) => (
                <div
                  key={song.id}
                  className="library-song"
                  onClick={() => {
                    if (currentSong === song.title) {
                      handlePlayPause();
                    } else {
                      playSong(song, song.id - 1, songs);
                    }
                  }}
                >
                  <div className="library-song-left">
                    <img src={song.image} alt={song.title} />

                    <div className="library-song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                  </div>

                  <div className="library-song-right">
                    <FaHeart
                      className="favorite-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites(favorites.filter((title) => title !== song.title));
                      }}
                    />
                    <span>{songDurations[song.id] || "--:--"}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No favorite songs yet ❤️</p>
            )}
            {librarySectionNav}
          </>
        )}

{/* -----------------------------------------artist sections---------------------------------------------------------------------- */}

        {activeSection === "artists" && (
          <>
            <div className="songs-page-header">
              <div>
                <span className="overview-label">YOUR ARTISTS</span>
                <h2>Artists</h2>
                <p>{artists.length} artists in your library</p>
              </div>
            </div>

              <div className="artist-grid">

                  {artists.map((artist) => {

                      // Find songs belonging to this artist
                      const artistSongs = songs.filter((song) => {

                          if (!song.artist) {
                              return false;
                          }

                          const songArtists = song.artist
                              .split(/[,/]/)
                              .map((name) => name.trim().toLowerCase())
                              .filter(Boolean);

                          return songArtists.includes(
                              artist.name.trim().toLowerCase()
                          );
                      });

                      return (
                          <div
                              key={artist.id}
                              className="album-box"
                              onClick={() => {
                                  navigate(
                                      `/artist/${artist.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`
                                  );
                              }}
                          >

                              <img
                                  src={artist.imageUrl}
                                  alt={artist.name}
                              />

                              <h3>{artist.name}</h3>

                              <p>
                                  {artistSongs.length} Songs
                              </p>

                          </div>
                      );
                  })}

              </div>
              {librarySectionNav}
          </>
      )}

{/*------------------------------------------------------Album Section------------------------------------------------------------ */}

          {activeSection === "albums" && (
            <>
              <div className="songs-page-header">
                <div>
                  <span className="overview-label">YOUR ALBUMS</span>
                  <h2>Albums</h2>
                  <p>{albums.length} albums in your library</p>
                </div>
              </div>

              <div className="artist-grid">

                {albums.map((album) => (

                  <div
                    key={album.id}
                    className="album-box"
                    onClick={() => {
                      navigate(
                        `/album/${album.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      );
                    }}
                  >

                    <img
                      src={album.imageUrl}
                      alt={album.name}
                    />

                    <h3>{album.name}</h3>

                    <p>{album.artist}</p>

                  </div>

                ))}

              </div>
              {librarySectionNav}
            </>
          )}

        {/* --------------------------------playlist--------------------------------------- */}
        {activeSection === "playlistDetails" && selectedPlaylist && (
          <>
            <button
              className="back-btn"
              onClick={() => {
                navigate("/library/playlists");
              }}
            >
              <FaArrowLeft />
              <span>Back to Playlists</span>
            </button>

            <div className="playlist-detail-header">

              <div className="playlist-cover">

                  {selectedPlaylist.songs.length > 0 ? (

                      <img
                          src={selectedPlaylist.songs[0].image}
                          alt={selectedPlaylist.name}
                          className="playlist-cover-image"
                      />

                  ) : (

                      <FaFolderOpen className="playlist-icon-large" />

                  )}

              </div>

              <div className="playlist-info">

                  <p className="playlist-type">
                      PLAYLIST
                  </p>

                  <h1>{selectedPlaylist.name}</h1>

                  <p className="playlist-meta">
                      Created by You • {selectedPlaylist.songs.length} Songs
                  </p>

                  <div className="artist-actions">

                  <button
                      className="artist-play-btn"
                      onClick={() => {
                          if (selectedPlaylist.songs.length > 0) {
                              playSong(
                                  selectedPlaylist.songs[0],
                                  0,
                                  selectedPlaylist.songs
                              );
                          }
                      }}
                  >
                      <>
                          <FaPlay />
                          <span>Play Playlist</span>
                      </>
                  </button>

                  <button
                      className="artist-shuffle-btn"
                      onClick={() => setShowSongModal(true)}
                  >
                      <>
                          <FaPlus />
                          <span>Add Songs</span>
                      </>
                  </button>

                </div>

              </div>

            </div>

            <h2 className="section-title">
              Tracks
            </h2>

            {selectedPlaylist.songs.length === 0 ? (
              <p>No songs in this playlist yet.</p>
            ) : (
              selectedPlaylist.songs.map((song, index) => (

                <div
                  key={song.id}
                  className="library-song"
                  onClick={() => {
                    if (currentSong === song.title) {
                      handlePlayPause();
                    } else {
                      playSong(song, index, selectedPlaylist.songs);
                    }
                  }}
                >

                  <div className="library-song-left">

                    <span className="song-number">
                      {index + 1}
                    </span>

                    <img
                      src={song.image}
                      alt={song.title}
                    />

                    <div className="library-song-info">

                      <h3>{song.title}</h3>

                      <p>{song.artist}</p>

                    </div>

                  </div>

                  <div className="library-song-right">

                    <span>
                      {songDurations[song.id] || "--:--"}
                    </span>

                    <FaTrash
                      className="delete-playlist-song-icon"
                      title="Remove from playlist"
                      onClick={async (e) => {
                          e.stopPropagation();

                          const updatedPlaylist = {
                              ...selectedPlaylist,
                              songs: selectedPlaylist.songs.filter(
                                  (playlistSong) => playlistSong.id !== song.id
                              ),
                          };

                          try {

                              const playlistRef = doc(
                                  db,
                                  "users",
                                  currentUser.uid,
                                  "playlists",
                                  String(selectedPlaylist.id)
                              );

                              await updateDoc(playlistRef, {
                                  songs: updatedPlaylist.songs,
                              });

                              const updatedPlaylists = playlists.map((playlist) =>
                                  playlist.id === selectedPlaylist.id
                                      ? updatedPlaylist
                                      : playlist
                              );

                              setPlaylists(updatedPlaylists);
                              setSelectedPlaylist(updatedPlaylist);

                          } catch (error) {

                              console.error(
                                  "Failed to remove song from playlist:",
                                  error
                              );

                          }
                      }}
                    />

                  </div>

                </div>

              ))
            )}
          </>
        )}



        {activeSection === "playlists" && (
          <>
            <div className="playlist-header">

              <h2>My Playlists</h2>

              <button
                className="create-playlist-btn"
                onClick={() => setShowPlaylistModal(true)}
              >
                + Create Playlist
              </button>

            </div>

            {playlists.length === 0 ? (

                <p>No playlists created yet.</p>

            ) : (

                playlists.map((playlist, index) => (

                    <div
                        key={playlist.id}
                        className="library-song playlist-item"
                        onClick={() => {
                            navigate(`/library/playlists/${playlist.id}`);
                        }}
                    >
                        <div className="playlist-card-left">

                          <div className="playlist-card-cover">
                              <FaFolder />
                          </div>

                          <div className="playlist-card-info">


                                {editingPlaylistId === playlist.id ? (
                                  <input
                                    className="playlist-edit-input"
                                    value={editedPlaylistName}
                                    onChange={(e) => setEditedPlaylistName(e.target.value)}
                                    onBlur={async () => {

                                      const newName = editedPlaylistName.trim();

                                      if (!newName) {
                                        setEditingPlaylistId(null);
                                        return;
                                      }

                                      try {

                                        const playlistRef = doc(
                                          db,
                                          "users",
                                          currentUser.uid,
                                          "playlists",
                                          String(playlist.id)
                                        );

                                        await updateDoc(playlistRef, {
                                          name: newName,
                                        });

                                        const updated = playlists.map((p) =>
                                          p.id === playlist.id
                                            ? { ...p, name: newName }
                                            : p
                                        );

                                        setPlaylists(updated);

                                        if (
                                          selectedPlaylist &&
                                          selectedPlaylist.id === playlist.id
                                        ) {
                                          setSelectedPlaylist(
                                            updated.find((p) => p.id === playlist.id)
                                          );
                                        }

                                      } catch (error) {

                                        console.error("Failed to rename playlist:", error);

                                      }

                                      setEditingPlaylistId(null);
                                    }}
                                    autoFocus
                                  />
                                ) : (
                                  <h3>{playlist.name}</h3>
                                )}
                                <p>{playlist.songs.length} Songs</p>
                            </div>

                        </div>

                        

                        <div className="playlist-card-actions">

                            <FaEdit
                              className="edit-playlist-icon"
                              onClick={(e) => {
                                e.stopPropagation();

                                setEditingPlaylistId(playlist.id);
                                setEditedPlaylistName(playlist.name);
                              }}
                            />

                            <FaTrash
                                className="delete-playlist-icon"
                                onClick={async (e) => {
                                  e.stopPropagation();

                                  const confirmDelete = window.confirm(
                                      `Delete "${playlist.name}"?`
                                  );

                                  if (!confirmDelete) return;

                                  try {

                                      const playlistRef = doc(
                                          db,
                                          "users",
                                          currentUser.uid,
                                          "playlists",
                                          String(playlist.id)
                                      );

                                      await deleteDoc(playlistRef);

                                      const updated = playlists.filter(
                                          (p) => p.id !== playlist.id
                                      );

                                      setPlaylists(updated);

                                      if (
                                          selectedPlaylist &&
                                          selectedPlaylist.id === playlist.id
                                      ) {
                                          setSelectedPlaylist(null);
                                          navigate("/library/playlists");
                                      }

                                  } catch (error) {

                                      console.error(
                                          "Failed to delete playlist:",
                                          error
                                      );

                                  }
                              }}
                            />

                        </div>

                    </div>

                ))

            )}
              {librarySectionNav}
          </>
        )}

      </div>
      {showPlaylistModal && (
        <div className="playlist-modal-overlay">

          <div className="playlist-modal">

            <h2>Create Playlist</h2>

            <input
                type="text"
                placeholder="Playlist Name"
                className="playlist-input"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
            />

            <div className="playlist-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => setShowPlaylistModal(false)}
              >
                Cancel
              </button>

              <button
                  className="create-btn"
                  onClick={async () => {

                    if (!playlistName.trim()) return;

                    if (!currentUser?.uid) {
                      alert("Please login first.");
                      return;
                    }

                    try {

                      const playlistId = Date.now();

                      const newPlaylist = {
                        id: playlistId,
                        name: playlistName.trim(),
                        songs: [],
                        createdAt: serverTimestamp(),
                      };

                      const playlistRef = doc(
                        db,
                        "users",
                        currentUser.uid,
                        "playlists",
                        String(playlistId)
                      );

                      await setDoc(playlistRef, newPlaylist);

                      setPlaylists((prev) => [
                        ...prev,
                        {
                          ...newPlaylist,
                          createdAt: new Date(),
                        },
                      ]);

                      setPlaylistName("");
                      setShowPlaylistModal(false);

                    } catch (error) {
                      console.error("Failed to create playlist:", error);
                    }

                  }}
              >
                  Create
              </button>

            </div>

          </div>

        </div>
      )}

      {showSongModal && (
        <div className="playlist-modal-overlay">
          <div className="playlist-modal">

            <h2>Add Songs to {selectedPlaylist.name}</h2>


            {songs.map((song) => (
              <label
                key={song.id}
                className="song-checkbox"
              >
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSongs([...selectedSongs, song.id]);
                    } else {
                      setSelectedSongs(
                        selectedSongs.filter((id) => id !== song.id)
                      );
                    }
                  }}
                />

                {song.title}
              </label>
            ))}

            <div className="playlist-modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowSongModal(false);
                  setSelectedSongs([]);
                }}
              >
                Cancel
              </button>

              <button
                className="create-btn"
                onClick={async () => {

                    const songsToAdd = songs.filter(song =>
                        selectedSongs.includes(song.id)
                    );

                    const updatedPlaylists = playlists.map((playlist) => {

                        if (playlist.id === selectedPlaylist.id) {

                            return {
                                ...playlist,

                                songs: [
                                    ...playlist.songs,

                                    ...songsToAdd.filter(
                                        newSong =>
                                            !playlist.songs.some(
                                                existing =>
                                                    existing.id === newSong.id
                                            )
                                    )
                                ]
                            };

                        }

                        return playlist;

                    });

                    const updatedPlaylist = updatedPlaylists.find(
                        p => p.id === selectedPlaylist.id
                    );

                    try {

                        const playlistRef = doc(
                            db,
                            "users",
                            currentUser.uid,
                            "playlists",
                            String(selectedPlaylist.id)
                        );

                        await updateDoc(playlistRef, {
                            songs: updatedPlaylist.songs,
                        });

                        setPlaylists(updatedPlaylists);
                        setSelectedPlaylist(updatedPlaylist);

                        setSelectedSongs([]);
                        setShowSongModal(false);

                    } catch (error) {

                        console.error(
                            "Failed to add songs to playlist:",
                            error
                        );

                    }

                }}
              >
                Add Selected
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
    
  );
}

export default Library;