import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Search.css";
import { getSongs } from "../services/api";
import { FaPlay, FaPause } from "react-icons/fa";

function Search({
  currentSong,
  playSong,
  isPlaying,
  handlePlayPause,
}) {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(query);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);

        const data = await getSongs();

        const formattedSongs = data.map((song) => ({
          ...song,
          image: song.coverUrl,
          audio: song.songUrl,
        }));

        setSongs(formattedSongs);

      } catch (error) {
        console.error("Failed to load songs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);
  
  const filteredSongs = songs.filter((song) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      song.title?.toLowerCase().includes(search) ||
      song.artist?.toLowerCase().includes(search) ||
      song.album?.toLowerCase().includes(search)
    );
  });
  return (
  <div className="search-page">

    <h1>Search Songs</h1>

    <div className="search-container">
      <input
        type="text"
        placeholder="Search your favorite songs..."
        className="search-box"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="search-results">

      <h2>Search Results</h2>

      {loading ? (
        <p>Loading songs...</p>
      ) : filteredSongs.length > 0 ? (
        filteredSongs.map((song) => (
          <div
            key={song.id}
            className={`search-song ${
              currentSong === song.title ? "active" : ""
            }`}
            onClick={() => {
              if (currentSong === song.title) {
                handlePlayPause();
              } else {
                playSong(
                  song,
                  filteredSongs.indexOf(song),
                  filteredSongs
                );
              }
            }}
          >
            <img
              src={song.image}
              alt={song.title}
            />

            <div className="song-details">
              <h3>{song.title}</h3>

              <p>
                {song.artist}

                {song.album && (
                  <>
                    <span className="song-separator"> • </span>
                    <span className="song-album">
                      {song.album}
                    </span>
                  </>
                )}
              </p>
            </div>

            <span className="song-duration">
              {song.duration || "0:00"}
            </span>

            <button
              className={`play-search-btn ${
                currentSong === song.title && isPlaying ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();

                if (currentSong === song.title) {
                  handlePlayPause();
                } else {
                  playSong(
                    song,
                    filteredSongs.indexOf(song),
                    filteredSongs
                  );
                }
              }}
            >
              {currentSong === song.title && isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        ))
      ) : (
        <p>No songs found.</p>
      )}

    </div>

  </div>
);
}

export default Search;
