import { useState, useEffect } from "react";
import { getSongs } from "../services/api";

function Admin() {

  // =====================================================
  // SONG STATES
  // =====================================================

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [duration, setDuration] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [songs, setSongs] = useState([]);


  // =====================================================
  // ARTIST STATES
  // =====================================================

  const [artistName, setArtistName] = useState("");
  const [artistImage, setArtistImage] = useState(null);

  const [artists, setArtists] = useState([]);


// =====================================================
// ALBUM STATES
// =====================================================

  const [albumName, setAlbumName] = useState("");
  const [albumArtist, setAlbumArtist] = useState("");
  const [albumImage, setAlbumImage] = useState(null);

  const [albums, setAlbums] = useState([]);

  // =====================================================
  // LOAD SONGS
  // =====================================================

  const loadSongs = async () => {

    try {

      const data = await getSongs();

      setSongs(data);

    } catch (error) {

      console.error(
        "Failed to load songs:",
        error
      );

    }

  };


  // =====================================================
  // LOAD ARTISTS
  // =====================================================

  const loadArtists = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/artists"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load artists"
        );
      }

      const data = await response.json();

      setArtists(data);

    } catch (error) {

      console.error(
        "Failed to load artists:",
        error
      );

    }

  };

// =====================================================
// LOAD ALBUMS
// =====================================================

  const loadAlbums = async () => {

      try {

          const response = await fetch(
              "http://localhost:5000/api/albums"
          );

          if (!response.ok) {
              throw new Error(
                  "Failed to load albums"
              );
          }

          const data = await response.json();

          setAlbums(data);

      } catch (error) {

          console.error(
              "Failed to load albums:",
              error
          );

      }

  };

  // =====================================================
  // LOAD DATA WHEN ADMIN OPENS
  // =====================================================

  useEffect(() => {

      loadSongs();
      loadArtists();
      loadAlbums();

  }, []);


  // =====================================================
  // UPLOAD SONG
  // =====================================================

  const handleUpload = async () => {

    try {

      const formData = new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "artist",
        artist
      );

      formData.append(
        "album",
        album
      );

      formData.append(
        "duration",
        duration
      );

      formData.append(
        "coverImage",
        coverImage
      );

      formData.append(
        "audioFile",
        audioFile
      );


      const response = await fetch(
        "http://localhost:5000/api/upload/song",
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await response.json();


      console.log(data);


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Upload failed"
        );

      }


      alert(
        "✅ Song uploaded successfully!"
      );


      await loadSongs();


    } catch (error) {

      console.error(error);


      alert(
        `❌ Upload failed: ${error.message}`
      );

    }

  };


  // =====================================================
  // ADD ARTIST
  // =====================================================

  const handleAddArtist = async () => {

    try {

      // -----------------------------
      // VALIDATION
      // -----------------------------

      if (!artistName.trim()) {

        alert(
          "Please enter artist name"
        );

        return;

      }


      if (!artistImage) {

        alert(
          "Please select artist image"
        );

        return;

      }


      // -----------------------------
      // STEP 1
      // UPLOAD IMAGE TO CLOUDINARY
      // -----------------------------

      const imageFormData =
        new FormData();

      imageFormData.append(
        "image",
        artistImage
      );


      const imageResponse =
        await fetch(
          "http://localhost:5000/api/upload/image",
          {
            method: "POST",
            body: imageFormData,
          }
        );


      const imageData =
        await imageResponse.json();


      if (!imageResponse.ok) {

        throw new Error(
          imageData.message ||
          "Artist image upload failed"
        );

      }


      console.log(
        "Artist image uploaded:",
        imageData
      );


      // -----------------------------
      // STEP 2
      // SAVE ARTIST TO FIRESTORE
      // -----------------------------

      const artistResponse =
        await fetch(
          "http://localhost:5000/api/artists",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              name:
                artistName.trim(),

              imageUrl:
                imageData.imageUrl,

            }),

          }
        );


      const artistData =
        await artistResponse.json();


      if (!artistResponse.ok) {

        throw new Error(
          artistData.message ||
          "Failed to create artist"
        );

      }


      console.log(
        "Artist created:",
        artistData
      );


      // -----------------------------
      // SUCCESS
      // -----------------------------

      alert(
        "✅ Artist added successfully!"
      );


      // Clear form

      setArtistName("");

      setArtistImage(null);


      // Reload artists

      await loadArtists();


    } catch (error) {

      console.error(error);


      alert(
        `❌ Artist upload failed: ${error.message}`
      );

    }

  };

  // =====================================================
// ADD ALBUM
// =====================================================

  const handleAddAlbum = async () => {

      try {

          // -----------------------------
          // VALIDATION
          // -----------------------------

          if (!albumName.trim()) {

              alert("Please enter album name");

              return;

          }

          if (!albumArtist.trim()) {

              alert("Please enter artist name");

              return;

          }

          if (!albumImage) {

              alert("Please select album cover");

              return;

          }


          // -----------------------------
          // STEP 1
          // UPLOAD ALBUM IMAGE
          // -----------------------------

          const imageFormData = new FormData();

          imageFormData.append(
              "image",
              albumImage
          );


          const imageResponse = await fetch(
              "http://localhost:5000/api/upload/album-image",
              {
                  method: "POST",
                  body: imageFormData,
              }
          );


          const imageData =
              await imageResponse.json();


          if (!imageResponse.ok) {

              throw new Error(
                  imageData.message ||
                  "Album cover upload failed"
              );

          }


          // -----------------------------
          // STEP 2
          // SAVE ALBUM TO FIRESTORE
          // -----------------------------

          const albumResponse = await fetch(
              "http://localhost:5000/api/albums",
              {
                  method: "POST",

                  headers: {
                      "Content-Type":
                          "application/json",
                  },

                  body: JSON.stringify({

                      name:
                          albumName.trim(),

                      artist:
                          albumArtist.trim(),

                      imageUrl:
                          imageData.imageUrl,

                  }),

              }
          );


          const albumData =
              await albumResponse.json();


          if (!albumResponse.ok) {

              throw new Error(
                  albumData.message ||
                  "Failed to create album"
              );

          }


          // -----------------------------
          // SUCCESS
          // -----------------------------

          alert(
              "✅ Album added successfully!"
          );


          // Clear form

          setAlbumName("");

          setAlbumArtist("");

          setAlbumImage(null);


          // Reload albums

          await loadAlbums();


      } catch (error) {

          console.error(error);


          alert(
              `❌ Album upload failed: ${error.message}`
          );

      }

  };



  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: "30px",
        color: "white",
        minHeight: "100vh",
      }}
    >

      <h1>
        MusicUniverse Admin Panel
      </h1>


      {/* =================================================
          UPLOAD SONG
      ================================================= */}

      <h2>
        Upload New Song
      </h2>


      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />


      <br />
      <br />


      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) =>
          setArtist(e.target.value)
        }
      />


      <br />
      <br />


      <input
        type="text"
        placeholder="Album"
        value={album}
        onChange={(e) =>
          setAlbum(e.target.value)
        }
      />


      <br />
      <br />


      <input
        type="text"
        placeholder="Duration (3:45)"
        value={duration}
        onChange={(e) =>
          setDuration(e.target.value)
        }
      />


      <br />
      <br />


      <label>
        Cover Image
      </label>


      <br />


      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setCoverImage(
            e.target.files[0]
          )
        }
      />


      <br />
      <br />


      <label>
        Audio File
      </label>


      <br />


      <input
        type="file"
        accept="audio/*"
        onChange={(e) =>
          setAudioFile(
            e.target.files[0]
          )
        }
      />


      <br />
      <br />


      <button
        onClick={handleUpload}
      >
        Upload Song
      </button>


      {/* =================================================
          ADD ARTIST
      ================================================= */}

      <hr
        style={{
          margin: "50px 0",
        }}
      />


      <h2>
        Add New Artist
      </h2>


      <input
        type="text"
        placeholder="Artist Name"
        value={artistName}
        onChange={(e) =>
          setArtistName(
            e.target.value
          )
        }
      />


      <br />
      <br />


      <label>
        Artist Image
      </label>


      <br />


      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setArtistImage(
            e.target.files[0]
          )
        }
      />


      <br />
      <br />


      <button
        onClick={handleAddArtist}
      >
        Add Artist
      </button>


      {/* =================================================
          ADD ALBUM
      ================================================= */}

      <hr
          style={{
              margin: "50px 0",
          }}
      />

      <h2>
          Add New Album
      </h2>

      <input
          type="text"
          placeholder="Album Name"
          value={albumName}
          onChange={(e) =>
              setAlbumName(e.target.value)
          }
      />

      <br />
      <br />

      <input
          type="text"
          placeholder="Artist Name"
          value={albumArtist}
          onChange={(e) =>
              setAlbumArtist(e.target.value)
          }
      />

      <br />
      <br />

      <label>
          Album Cover
      </label>

      <br />

      <input
          type="file"
          accept="image/*"
          onChange={(e) =>
              setAlbumImage(
                  e.target.files[0]
              )
          }
      />

      <br />
      <br />

      <button
          onClick={handleAddAlbum}
      >
          Add Album
      </button>


      {/* =================================================
          MANAGE ARTISTS
      ================================================= */}

      <hr
        style={{
          margin: "50px 0",
        }}
      />


      <h2>
        Manage Artists
      </h2>


      <p>
        Total Artists: {artists.length}
      </p>


      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >

        {artists.map((artist) => (

          <div
            key={artist.id}
            style={{
              width: "200px",
              padding: "20px",
              background: "#1e293b",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >

            <img
              src={artist.imageUrl}
              alt={artist.name}
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />


            <h3>
              {artist.name}
            </h3>

          </div>

        ))}

      </div>


      {/* =================================================
          MANAGE SONGS
      ================================================= */}

      <hr
        style={{
          margin: "50px 0",
        }}
      />


      <h2>
        Manage Songs
      </h2>


      <p>
        Total Songs: {songs.length}
      </p>


      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "800px",
        }}
      >

        {songs.map((song) => (

          <div
            key={song.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "15px",
              background: "#1e293b",
              borderRadius: "10px",
            }}
          >

            <img
              src={song.coverUrl}
              alt={song.title}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />


            <div>

              <h3
                style={{
                  margin:
                    "0 0 5px 0",
                }}
              >
                {song.title}
              </h3>


              <p>
                Artist: {song.artist}
              </p>


              <p>
                Album: {song.album}
              </p>


              <p>
                Duration: {song.duration}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Admin;