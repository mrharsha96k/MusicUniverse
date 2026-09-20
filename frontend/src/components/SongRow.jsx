import { FaPlay, FaPause } from "react-icons/fa";
import "../styles/SongRow.css";

function SongRow({
    song,
    index,
    songsList,
    currentSong,
    isPlaying,
    playSong,
    handlePlayPause,
    duration,
    currentTime,
}) {

    const isCurrentSong = currentSong === song.title;
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <div
            className={`song-row ${isCurrentSong ? "active-song-row" : ""}`}
            onClick={() => {

                if (isCurrentSong) {
                    handlePlayPause();
                } else {
                    playSong(song, index, songsList);
                }

            }}
        >

            <div className="song-row-number">
                <span className="song-number">
                    {index + 1}
                </span>

                <span className="song-row-play">
                    {isCurrentSong && isPlaying ? <FaPause /> : <FaPlay />}
                </span>
            </div>

            <img
                src={song.image}
                alt={song.title}
                className="song-row-image"
            />

            <div className="song-row-info">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
            </div>

            <span className="song-row-year">
                {song.year}
            </span>

            <span className="song-row-duration">
                {isCurrentSong
                    ? `${formatTime(currentTime)} / ${duration}`
                    : duration}
            </span>

        </div>
    );
}

export default SongRow;