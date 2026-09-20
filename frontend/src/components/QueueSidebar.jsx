import { FaPlay } from "react-icons/fa";
import "./../styles/QueueSidebar.css";

function QueueSidebar({
    currentQueue,
    currentSong,
    currentArtist,
    currentSongIndex,
    playedHistory,
    showPlayedHistory,
    setShowPlayedHistory,
    playSong,
    showQueue,
}) {


    return (

        <aside
            className={`queue-sidebar ${showQueue ? "show" : "hide"}`}
        >

            <div className="queue-header">

                <h2>Queue</h2>

                <p>
                    {currentQueue.length} Songs
                </p>

            </div>

            <div className="now-playing-card">

                <span className="now-playing-label">
                    NOW PLAYING
                </span>

                {currentQueue.find(song => song.title === currentSong) && (

                    <div className="now-playing-song">

                        <img
                            src={
                                currentQueue.find(song => song.title === currentSong).image
                            }
                            alt={currentSong}
                            className="now-playing-cover"
                        />

                        <div className="now-playing-info">

                            <h3>{currentSong}</h3>

                            <p>{currentArtist}</p>

                        </div>

                    </div>

                )}

            </div>

            <h3 className="up-next-title">
                Up Next
            </h3>

            {currentQueue.length === 0 ? (

                <p>No songs in queue.</p>

            ) : (

                currentQueue
                    .slice(currentSongIndex + 1, currentSongIndex + 6)
                    .map((song, index) => (

                    <div
                        key={song.id}
                        className="queue-song"
                        onClick={() => {
                            playSong(
                                song,
                                currentSongIndex + index + 1,
                                currentQueue
                            )
                        }}
                    >

                        <img
                            src={song.image}
                            alt={song.title}
                        />

                        <div className="queue-song-info">

                            <span className="queue-play-icon">
                                <FaPlay />
                            </span>

                            <h4>{song.title}</h4>

                            <p>{song.artist}</p>
                            <span className="queue-duration">
                                {song.duration}
                            </span>

                        </div>

                    </div>

                ))

            )}

        

        </aside>

    );

}

export default QueueSidebar;