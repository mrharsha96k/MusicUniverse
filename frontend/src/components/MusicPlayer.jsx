
import { useEffect, useState } from "react";

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaVolumeUp,
  FaListUl,
  FaExpand,
  FaCompress,
  FaTimes,
  FaRandom,
  FaRedo,
  FaChevronDown,
} from "react-icons/fa";

import "../styles/MusicPlayer.css";

function MusicPlayer({
    currentSong,
    currentArtist,
    currentImage,
    currentAudio,
    audioRef,
    isPlaying,
    setIsPlaying,
    handlePlayPause,
    handleNext,
    handlePrevious,
    currentTime,
    duration,
    setCurrentTime,
    setDuration,
    volume,
    setVolume,
    favorites,
    setFavorites,
    currentQueue,
    playSong,
    showQueue,
    setShowQueue,
}) {
    
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    useEffect(() => {
        if (currentAudio && audioRef.current) {
            audioRef.current.load();
            audioRef.current.volume = volume;

            audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.log("Playback blocked:", err));
        }
    }, [currentAudio]);

    const formatTime = (time) => {
        if (!time) return "0:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const isFavorite = favorites.includes(currentSong);

    const toggleFullscreen = () => {
        setIsFullscreen((prev) => !prev);
    };

      return (
    <>
      {/* ================= MINI PLAYER ================= */}

      <div className="music-player">

        {/* LEFT - SONG INFO */}
        <div className="player-left">

          <div className="album-cover">
            <img
              src={currentImage || "/src/assets/blinding-lights.jpg"}
              alt="Album Cover"
              className={isPlaying ? "playing" : ""}
            />
          </div>

          <div className="music-info">
            <span className="player-label">
              NOW PLAYING
            </span>

            <h3>
              {currentSong || "No song selected"}
            </h3>

            <p>
              {currentArtist || "Unknown Artist"}
            </p>
          </div>

          <button
            className={`mini-favorite-btn ${
              isFavorite ? "active" : ""
            }`}
            onClick={() => {
              if (!currentSong) return;

              if (isFavorite) {
                setFavorites(
                  favorites.filter(
                    (song) => song !== currentSong
                  )
                );
              } else {
                setFavorites((prev) => [
                  ...prev,
                  currentSong,
                ]);
              }
            }}
          >
            <FaHeart />
          </button>

        </div>


        {/* CENTER - CONTROLS */}
        <div className="player-center">

          <div className="music-controls">

            <button
              className="secondary-control"
              title="Shuffle"
            >
              <FaRandom />
            </button>

            <button
              onClick={handlePrevious}
              title="Previous"
            >
              <FaStepBackward />
            </button>

            <button
              className="main-play-btn"
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>

            <button
              onClick={handleNext}
              title="Next"
            >
              <FaStepForward />
            </button>

            <button
              className={`secondary-control ${isRepeat ? "active" : ""}`}
              onClick={() => setIsRepeat((prev) => !prev)}
              title={isRepeat ? "Repeat On" : "Repeat Off"}
            >
              <FaRedo />
            </button>

          </div>


          {/* PROGRESS */}
          <div className="progress-section">

            <span className="progress-time">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {

                const newTime = Number(
                  e.target.value
                );

                if (audioRef.current) {
                  audioRef.current.currentTime =
                    newTime;
                }

                setCurrentTime(newTime);

              }}
              className="progress-bar"
            />

            <span className="progress-time">
              {formatTime(duration)}
            </span>

          </div>

        </div>


        {/* RIGHT CONTROLS */}
        <div className="player-right">

          <div className="volume-control">

            <FaVolumeUp />

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                style={{
                    background: `linear-gradient(
                        to right,
                        #22c55e ${volume * 100}%,
                        #334155 ${volume * 100}%
                    )`
                }}
                onChange={(e) => {

                    const newVolume = Number(e.target.value);

                    setVolume(newVolume);

                    if (audioRef.current) {
                        audioRef.current.volume = newVolume;
                    }

                }}
            />

          </div>


          <button
            className={`queue-btn ${
              showQueue ? "active" : ""
            }`}
            onClick={() =>
              setShowQueue(!showQueue)
            }
            title="Queue"
          >
            <FaListUl />
          </button>


          {/* FULLSCREEN BUTTON */}
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title="Fullscreen Player"
          >
            <FaExpand />
          </button>

        </div>


        {/* AUDIO ELEMENT */}
        <audio
          ref={audioRef}
          src={currentAudio}
          style={{ display: "none" }}

          onPlay={() =>
            setIsPlaying(true)
          }

          onPause={() =>
            setIsPlaying(false)
          }

          onTimeUpdate={() =>
            setCurrentTime(
              audioRef.current.currentTime
            )
          }

          onLoadedMetadata={() =>
            setDuration(
              audioRef.current.duration
            )
          }

          onEnded={() => {
            if (isRepeat) {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            } else {
              handleNext();
            }
          }}
        />

      </div>


      {/* ================================================= */}
      {/*              FULLSCREEN MUSIC PLAYER              */}
      {/* ================================================= */}

      {isFullscreen && (

        <div className="fullscreen-player">

          {/* BACKGROUND GLOW */}
          <div className="fullscreen-glow"></div>


          {/* TOP BAR */}
          <div className="fullscreen-topbar">

            <button
              className="fullscreen-close"
              onClick={toggleFullscreen}
              title="Close Fullscreen"
            >
              <FaChevronDown />
            </button>

            <span>
              MUSICUNIVERSE
            </span>

            <button
              className="fullscreen-close"
              onClick={toggleFullscreen}
              title="Close"
            >
              <FaTimes />
            </button>

          </div>


          {/* MAIN CONTENT */}
          <div className="fullscreen-content">


            {/* ALBUM ART */}
            <div className="fullscreen-art-section">

              <div className="fullscreen-album-glow"></div>

              <img
                src={
                  currentImage ||
                  "/src/assets/blinding-lights.jpg"
                }
                alt={currentSong || "Album"}
                className={
                  `fullscreen-album ${
                    isPlaying
                      ? "fullscreen-album-playing"
                      : ""
                  }`
                }
              />

            </div>


            {/* CENTER PLAYER */}
            <div className="fullscreen-center">

              <span className="fullscreen-label">
                NOW PLAYING
              </span>

              <h1>
                {currentSong ||
                  "No song selected"}
              </h1>

              <p className="fullscreen-artist">
                {currentArtist ||
                  "Unknown Artist"}
              </p>


              {/* LIKE */}
              <button
                className={`fullscreen-like ${
                  isFavorite ? "active" : ""
                }`}
                onClick={() => {

                  if (!currentSong) return;

                  if (isFavorite) {

                    setFavorites(
                      favorites.filter(
                        (song) =>
                          song !== currentSong
                      )
                    );

                  } else {

                    setFavorites((prev) => [
                      ...prev,
                      currentSong,
                    ]);

                  }

                }}
              >
                <FaHeart />

                <span>
                  {isFavorite
                    ? "Liked"
                    : "Like"}
                </span>

              </button>


              {/* VISUALIZER */}
              <div className="visualizer">

                {Array.from({
                  length: 45,
                }).map((_, index) => (

                  <span
                    key={index}
                    className={
                      isPlaying
                        ? "visualizer-bar playing"
                        : "visualizer-bar"
                    }
                    style={{
                      animationDelay:
                        `${index * 0.035}s`,
                    }}
                  />

                ))}

              </div>


              {/* FULLSCREEN PROGRESS */}
              <div className="fullscreen-progress">

                <span>
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => {

                    const newTime =
                      Number(e.target.value);

                    if (audioRef.current) {
                      audioRef.current.currentTime =
                        newTime;
                    }

                    setCurrentTime(newTime);

                  }}
                />

                <span>
                  {formatTime(duration)}
                </span>

              </div>


              {/* LARGE CONTROLS */}
              <div className="fullscreen-controls">

                <button>
                  <FaRandom />
                </button>

                <button
                  onClick={handlePrevious}
                >
                  <FaStepBackward />
                </button>

                <button
                  className="fullscreen-play-btn"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>

                <button
                  onClick={handleNext}
                >
                  <FaStepForward />
                </button>

                <button
                  className={isRepeat ? "fullscreen-tool-active" : ""}
                  onClick={() => setIsRepeat((prev) => !prev)}
                  title={isRepeat ? "Repeat On" : "Repeat Off"}
                >
                  <FaRedo />
                </button>

              </div>


              {/* BOTTOM TOOLS */}
              <div className="fullscreen-tools">

                <FaVolumeUp />

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {

                    const newVolume =
                      Number(e.target.value);

                    setVolume(newVolume);

                    if (audioRef.current) {
                      audioRef.current.volume =
                        newVolume;
                    }

                  }}
                />

                <button
                  onClick={() =>
                    setShowQueue(!showQueue)
                  }
                  className={
                    showQueue
                      ? "fullscreen-tool-active"
                      : ""
                  }
                >
                  <FaListUl />
                </button>

                <button
                  onClick={toggleFullscreen}
                >
                  <FaCompress />
                </button>

              </div>

            </div>


            {/* UP NEXT */}
            <div className="fullscreen-queue">

              <div className="fullscreen-queue-header">

                <h2>
                  Up Next
                </h2>

                <span>
                  {currentQueue?.length || 0}
                  {" "}Songs
                </span>

              </div>


              <div className="fullscreen-queue-list">

                {currentQueue &&
                currentQueue.length > 0 ? (

                  currentQueue.map(
                    (song, index) => (

                      <div
                        key={song.id}
                        className={
                          `fullscreen-queue-song ${
                            song.title ===
                            currentSong
                              ? "current"
                              : ""
                          }`
                        }
                        onClick={() => {

                          playSong(
                            song,
                            index,
                            currentQueue
                          );

                        }}
                      >

                        <img
                          src={song.image}
                          alt={song.title}
                        />

                        <div>
                          <h4>
                            {song.title}
                          </h4>

                          <p>
                            {song.artist}
                          </p>
                        </div>

                      </div>

                    )
                  )

                ) : (

                  <p className="empty-queue">
                    No songs in queue
                  </p>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default MusicPlayer;