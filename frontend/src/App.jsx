import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import MusicPlayer from "./components/MusicPlayer";
import { SearchOverlayProvider } from "./context/SearchOverlayContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Discover from "./pages/Discover";
import { getSongs } from "./services/api";
import Navbar from "./components/Navbar";
import QueueSidebar from "./components/QueueSidebar";
import { SearchProvider } from "./context/SearchContext";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./services/firebase";

function App() {

  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [apiSongs, setApiSongs] = useState([]);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [showPlayedHistory, setShowPlayedHistory] = useState(false);
  const [playedHistory, setPlayedHistory] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const [showQueue, setShowQueue] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getSongs();

        const formattedSongs = data.map((song) => ({
          ...song,
          image: song.coverUrl,
          audio: song.songUrl,
        }));

        setApiSongs(formattedSongs);
        setCurrentQueue(formattedSongs);

      } catch (error) {
        console.error("Failed to load songs:", error);
      }
    };

  loadSongs();
}, []);





    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);

        if (!user) {
          setFavorites([]);
          setRecentlyPlayed([]);
          return;
        }

        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setFavorites(
              Array.isArray(data.favorites)
                ? data.favorites
                : []
            );
            setRecentlyPlayed(
              Array.isArray(data.recentlyPlayed)
                ? data.recentlyPlayed
                : []
            );
          } else {
            setFavorites([]);
            setRecentlyPlayed([]);
          }
        } catch (error) {
          console.error("Failed to load favorites:", error);
          setFavorites([]);
          setRecentlyPlayed([]);  
        }
      });

      return () => unsubscribe();
    }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const handleNext = () => {
    if (!currentQueue || currentQueue.length === 0) return;

    // Find the currently playing song inside the current queue
    const currentIndex = currentQueue.findIndex(
      (song) => song.title === currentSong
    );

    if (currentIndex === -1) return;

    const finishedSong = currentQueue[currentIndex];

    if (finishedSong) {
      setPlayedSongs((prev) => {
        if (prev.some((song) => song.id === finishedSong.id)) {
          return prev;
        }

        return [...prev, finishedSong];
      });
    }

    const nextIndex =
      (currentIndex + 1) % currentQueue.length;

    const nextSong = currentQueue[nextIndex];

    setCurrentSong(nextSong.title);
    setCurrentArtist(nextSong.artist);
    setCurrentImage(nextSong.image);
    setCurrentAudio(nextSong.audio);
    setCurrentSongIndex(nextIndex);
  };


  const handlePrevious = () => {
    if (!currentQueue || currentQueue.length === 0) return;

    // Find the currently playing song inside the current queue
    const currentIndex = currentQueue.findIndex(
      (song) => song.title === currentSong
    );

    if (currentIndex === -1) return;

    const previousIndex =
      (currentIndex - 1 + currentQueue.length) %
      currentQueue.length;

    const previousSong = currentQueue[previousIndex];

    setCurrentSong(previousSong.title);
    setCurrentArtist(previousSong.artist);
    setCurrentImage(previousSong.image);
    setCurrentAudio(previousSong.audio);
    setCurrentSongIndex(previousIndex);
  };

  const playSong = (song, index, queue = apiSongs) => {
    // Save the previously playing song
    if (currentSong) {

        const previousSong =
          currentSongIndex >= 0
              ? currentQueue[currentSongIndex]
              : null;

        if (previousSong) {

            setPlayedHistory((prev) => {

                // Prevent duplicates
                const filtered = prev.filter(
                    (item) => item.id !== previousSong.id
                );

                // Add the previous song at the top
                return [previousSong, ...filtered];

            });

        }

    }
    

    setCurrentQueue(queue);

    setCurrentSong(song.title);
    setCurrentArtist(song.artist);
    setCurrentImage(song.image);
    setCurrentAudio(song.audio);

    setCurrentSongIndex(index);

    setRecentlyPlayed((prev) => {
      // Remove the song if it already exists
      const filtered = prev.filter(
        (item) => item.id !== song.id
      );

      // Add the new song at the beginning
      const updated = [song, ...filtered].slice(0, 20);

      // Save to Firestore for logged-in user
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        const safeRecentlyPlayed = updated.map((song) =>
          Object.fromEntries(
            Object.entries(song).filter(
              ([, value]) => value !== undefined
            )
          )
        );

        setDoc(
          userRef,
          {
            recentlyPlayed: safeRecentlyPlayed,
          },
          { merge: true }
        ).catch((error) => {
          console.error(
            "Failed to save recently played:",
            error
          );
        });
      }

      return updated;
    });

      };

    const updateFavorites = (newFavorites) => {
      if (!currentUser) {
        setShowLoginPopup(true);
        return;
      }

      setFavorites((prevFavorites) => {
        const updatedFavorites =
          typeof newFavorites === "function"
            ? newFavorites(prevFavorites)
            : newFavorites;

        const userRef = doc(
          db,
          "users",
          currentUser.uid
        );

        setDoc(
          userRef,
          {
            favorites: updatedFavorites,
          },
          { merge: true }
        ).catch((error) => {
          console.error(
            "Failed to save favorites:",
            error
          );
        });

        return updatedFavorites;
      });
    };

  return (
    
  <SearchProvider>
    <SearchOverlayProvider>
        <BrowserRouter>

        <div className="app-layout">


              <Navbar
                playSong={playSong}
              />

              <div className="app-main">

              <div className="page-content">

                  <Routes>

                      <Route
                        path="/"
                        element={
                          <Home
                            currentSong={currentSong}
                            setCurrentSong={setCurrentSong}
                            currentArtist={currentArtist}
                            setCurrentArtist={setCurrentArtist}
                            currentImage={currentImage}
                            setCurrentImage={setCurrentImage}
                            currentAudio={currentAudio}
                            setCurrentAudio={setCurrentAudio}
                            audioRef={audioRef}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            playSong={playSong}
                            recentlyPlayed={recentlyPlayed}
                            setRecentlyPlayed={setRecentlyPlayed}
                            currentTime={currentTime}
                          />
                        }
                      />

                      <Route
                        path="/search"
                        element={
                          <Search
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                          />
                        }
                      />

                      <Route
                          path="/discover"
                          element={
                              <Discover
                                  playSong={playSong}
                                  currentSong={currentSong}
                                  isPlaying={isPlaying}
                              />
                          }
                      />

                      <Route
                        path="/library"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/songs"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/favorites"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/albums"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/artists"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/playlists"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/library/playlists/:id"
                        element={
                          <Library
                            currentSong={currentSong}
                            playSong={playSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                            currentTime={currentTime}
                            favorites={favorites}
                            setFavorites={updateFavorites}
                            currentUser={currentUser}
                            recentlyPlayed={recentlyPlayed}
                          />
                        }
                      />

                      <Route
                        path="/artist/:name"
                        element={
                          <Artist
                            playSong={playSong}
                            currentSong={currentSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                          />
                        }
                      />

                      <Route
                        path="/album/:name"
                        element={
                          <Album
                            playSong={playSong}
                            currentSong={currentSong}
                            isPlaying={isPlaying}
                            handlePlayPause={handlePlayPause}
                          />
                        }
                      />
                      <Route
                        path="/login"
                        element={<Login />}
                      />

                      <Route
                        path="/signup"
                        element={<Signup />}
                      />
                      <Route
                        path="/profile"
                        element={<Profile />}
                      />

                      <Route
                          path="/admin"
                          element={<Admin />}
                      />

                  </Routes>

              </div>

              <QueueSidebar
                  currentQueue={currentQueue}
                  currentSong={currentSong}
                  currentArtist={currentArtist}
                  currentSongIndex={currentSongIndex}
                  playedHistory={playedHistory}
                  playedSongs={playedSongs}
                  setPlayedSongs={setPlayedSongs}
                  showPlayedHistory={showPlayedHistory}
                  setShowPlayedHistory={setShowPlayedHistory}
                  playSong={playSong}
                  showQueue={showQueue}
              />
          </div>

            <MusicPlayer
              currentSong={currentSong}
              currentArtist={currentArtist}
              currentImage={currentImage}
              currentAudio={currentAudio}
              audioRef={audioRef}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              handlePlayPause={handlePlayPause}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              currentTime={currentTime}
              duration={duration}
              setCurrentTime={setCurrentTime}
              setDuration={setDuration}
              volume={volume}
              setVolume={setVolume}
              favorites={favorites}
              setFavorites={updateFavorites}

              currentQueue={currentQueue}
              playSong={playSong}
              
              showQueue={showQueue}
              setShowQueue={setShowQueue}
            />

          </div>

        </BrowserRouter>
        {showLoginPopup && (
          <div className="login-required-overlay">

            <div className="login-required-popup">

              <div className="login-required-icon">
                ❤️
              </div>

              <h2>Login Required</h2>

              <p>
                Login to save songs to your Favorites.
              </p>

              <div className="login-required-actions">

                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    window.location.href = "/login";
                  }}
                >
                  Login
                </button>

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowLoginPopup(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}
     </SearchOverlayProvider>
  </SearchProvider>
  
);
}

export default App;