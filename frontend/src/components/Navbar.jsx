import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useEffect, useState, useRef } from "react";
import { useSearchOverlay } from "../context/SearchOverlayContext";
import { useSearch } from "../context/SearchContext";
import { FaUser } from "react-icons/fa";

import "../styles/Navbar.css";

import SearchOverlay from "./SearchOverlay";
import { getSongs } from "../services/api";

function Navbar({ playSong }) {
  const location = useLocation();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const { searchTerm, setSearchTerm } = useSearch();

  const {
    showOverlay,
    setShowOverlay,
    searchRef,
  } = useSearchOverlay();

  const [songs, setSongs] = useState([]);

  // =====================================================
  // LOAD SONGS
  // =====================================================

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
        console.error(
          "Failed to load songs in Navbar:",
          error
        );
      }
    };

    loadSongs();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredSongs = songs.filter((song) => {
    const title = song.title?.toLowerCase() || "";
    const artist = song.artist?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      title.includes(search) ||
      artist.includes(search)
    );
  });

  // =====================================================
  // SEARCH ARTISTS
  // =====================================================

  const artists = [];

  songs.forEach((song) => {
    if (!song.artist) return;

    song.artist
      .split(/[,/]/)
      .map((artist) => artist.trim())
      .filter(Boolean)
      .forEach((artistName) => {
        if (
          !artists.some(
            (artist) =>
              artist.name.toLowerCase() ===
              artistName.toLowerCase()
          )
        ) {
          artists.push({
            name: artistName,
            image: song.coverUrl,
          });
        }
      });
  });

  const filteredArtists = artists.filter((artist) =>
    artist.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // =====================================================
  // ACTIVE NAV
  // =====================================================

  const isHome = location.pathname === "/";

  const isDiscover =
    location.pathname === "/discover";

  const isLibrary =
    location.pathname.startsWith("/library");

  return (
    
    <nav className="navbar">

      {/* =================================================
          LEFT — BRAND
      ================================================= */}

      <div className="navbar-left">

        <Link to="/" className="brand">

          <img
            src="/music-universe-logo.png"
            alt="MusicUniverse"
            className="brand-logo"
          />

          <div className="brand-name">
            <span className="brand-music">
              Music
            </span>
            <span className="brand-universe">
              Universe
            </span>
          </div>

        </Link>

      </div>


      {/* =================================================
          CENTER — NAVIGATION
      ================================================= */}

      <div className="navbar-center">

        <div className="nav-pill">

          {/* HOME */}

          <Link
            to="/"
            className={`nav-item ${
              isHome ? "active" : ""
            }`}
          >
            <span className="nav-icon">
              ⌂
            </span>

            <span className="nav-label">
              Home
            </span>
          </Link>


          <div className="nav-divider" />


          {/* DISCOVER */}

          <Link
            to="/discover"
            className={`nav-item ${
              isDiscover ? "active" : ""
            }`}
          >
            <span className="nav-icon">
              ◇
            </span>

            <span className="nav-label">
              Discover
            </span>
          </Link>


          <div className="nav-divider" />


          {/* LIBRARY */}

          <Link
            to="/library"
            className={`nav-item ${
              isLibrary ? "active" : ""
            }`}
          >
            <span className="nav-icon">
              ▥
            </span>

            <span className="nav-label">
              Library
            </span>
          </Link>

        </div>

      </div>


      {/* =================================================
          RIGHT — SEARCH + PROFILE
      ================================================= */}

      <div className="navbar-right">

        {/* SEARCH */}

        <div
          className="navbar-search"
          ref={searchRef}
        >

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search songs, artists..."
            value={searchTerm}
            onFocus={() =>
              setShowOverlay(true)
            }
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {showOverlay &&
            searchTerm.trim() && (
              <SearchOverlay
                songs={filteredSongs}
                artists={filteredArtists}

                playSong={(song) => {
                  const index =
                    songs.findIndex(
                      (s) => s.id === song.id
                    );

                  playSong(
                    song,
                    index,
                    songs
                  );
                }}

                setSearchTerm={
                  setSearchTerm
                }
              />
            )}

        </div>


        {/* DIVIDER */}

        <div className="profile-divider" />


        {/* PROFILE */}

        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <button
            className="profile-button"
            type="button"
            onClick={() =>
              setShowProfileMenu((prev) => !prev)
            }
          >
            <div className="profile-avatar">
              {user ? (
                user.email?.charAt(0).toUpperCase()
              ) : (
                <FaUser />
              )}
            </div>

          </button>

          {showProfileMenu && (
            <div className="profile-menu">

              {user ? (
                <>
                  <div className="profile-menu-user">
                    <div className="profile-menu-avatar">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>MusicUniverse User</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="profile-menu-divider" />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>

                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="profile-menu-user">
                    <div className="profile-menu-avatar">
                      
                    </div>

                    <div>
                      <strong>Guest User</strong>
                      <span>Login to save your music</span>
                    </div>
                  </div>

                  <div className="profile-menu-divider" />

                  <button
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </>
              )}

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;