import "../styles/SearchDropdown.css";

function SearchDropdown({
  songs,
  playSong,
}) {
  if (songs.length === 0) return null;

  return (
    <div className="search-dropdown">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="dropdown-item"
          onClick={() => {
                playSong(song, song.id - 1);
                document.activeElement.blur();
            }}
        >
          <img src={song.image} alt={song.title} />

          <div className="dropdown-info">
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </div>

          <span className="dropdown-duration">
            {song.duration}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SearchDropdown;