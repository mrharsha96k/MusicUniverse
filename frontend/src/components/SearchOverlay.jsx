import "../styles/SearchOverlay.css";
import { useNavigate } from "react-router-dom";

function SearchOverlay({
  songs,
  artists,
  playSong,
  setSearchTerm,
}) {

  const navigate = useNavigate();
  if (songs.length === 0 && artists.length === 0) return null;

  return (
    <div className="search-overlay">

      <div className="search-grid">

        {/* TOP RESULT */}
        <div className="overlay-section">
          <div className="overlay-header">
            <h3>TOP RESULT</h3>
          </div>

          {artists.length > 0 && (
            <div
              className="top-result clickable"
              onClick={() => {
                navigate(
                  `/artist/${artists[0].name.toLowerCase().replace(/\s+/g, "-")}`
                );
              }}
            >
              <img
                src={artists[0].image}
                alt={artists[0].name}
              />

              <div>
                <h4>{artists[0].name}</h4>
                <p>Artist</p>
              </div>
            </div>
          )}
        </div>

        {/* SONGS */}
        <div className="overlay-section">

          <div className="overlay-header">
            <h3>SONGS</h3>
            <button>View All</button>
          </div>

          {songs.slice(0, 4).map((song) => (
              <div
                key={song.id}
                className="overlay-song clickable"
                onClick={() => {
                  playSong(song);
                }}
              >
              <img
                src={song.image}
                alt={song.title}
              />

              <div>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ARTISTS */}
        <div className="overlay-section">

          <div className="overlay-header">
            <h3>ARTISTS</h3>
          </div>

          {artists.map((artist) => (
            <div
                key={artist.name}
                className="overlay-song clickable"
                onClick={() => {
                    navigate(
                        `/artist/${artist.name.toLowerCase().replace(/\s+/g, "-")}`
                    );
                }}
            >
              <img
                src={artist.image}
                alt={artist.name}
              />

              <div>
                <h4>{artist.name}</h4>
                <p>Artist</p>
              </div>
            </div>
          ))}

        </div>

        {/* ALBUMS */}
        <div className="overlay-section">

          <div className="overlay-header">
            <h3>ALBUMS</h3>
          </div>

          {songs.slice(0, 4).map((song) => (
            <div
                  key={`album-${song.id}`}
                  className="overlay-song clickable"
                  onClick={() => {
                      navigate(
                          `/album/${song.title.toLowerCase().replace(/\s+/g, "-")}`
                      );
                  }}
              >
              <img
                src={song.image}
                alt={song.title}
              />

              <div>
                <h4>{song.title}</h4>
                <p>Album</p>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default SearchOverlay;