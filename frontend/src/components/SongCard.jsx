import "../styles/SongCard.css";

function SongCard({
  songId,
  title,
  artist,
  image,
  audio,
  duration,
  genre,
  year,
  isPlaying,
  currentSong,
  playSong,
  handlePlayPause,
  index = 0,
  songsList,
}) {
  const song = {
    id: songId,
    title,
    artist,
    image,
    audio,
    duration,
    genre,
    year,
  };

  const handlePlay = (e) => {
    e?.stopPropagation();

    // Same song → pause / resume
    if (currentSong === title) {
      handlePlayPause();
      return;
    }

    // Play new song
    if (playSong) {
      playSong(song, index, songsList);
    }
  };

  return (
    <div
      className={`song-card ${
        currentSong === title ? "song-card-active" : ""
      }`}
      onClick={handlePlay}
    >
      {/* Album Artwork */}
      <div className="song-image">
        <img
          src={image}
          alt={`${title} album cover`}
          loading="lazy"
        />

        {/* Play Button */}
        <button
          className={`play-overlay ${
            currentSong === title && isPlaying
              ? "playing"
              : ""
          }`}
          onClick={handlePlay}
          aria-label={
            currentSong === title && isPlaying
              ? `Pause ${title}`
              : `Play ${title}`
          }
        >
          {currentSong === title && isPlaying ? "Ⅱ" : "▶"}
        </button>

        {/* Playing Indicator */}
        {currentSong === title && isPlaying && (
          <div className="playing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      {/* Song Information */}
      <div className="song-info">
        <h3 title={title}>
          {title}
        </h3>

        <p className="song-artist" title={artist}>
          {artist}
        </p>

        <div className="song-meta">
          {duration && (
            <span>{duration}</span>
          )}

          {genre && (
            <span className="song-genre">
              {genre}
            </span>
          )}
        </div>

        {year && (
          <p className="song-year">
            {year}
          </p>
        )}
      </div>
    </div>
  );
}

export default SongCard;