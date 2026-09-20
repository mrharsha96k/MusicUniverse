const uploadRoute = require("./routes/upload");
const express = require("express");
const cors = require("cors");
const songsRoute = require("./routes/songs");
const artistsRoute = require("./routes/artists");
const albumsRoute = require("./routes/albums");
// const playlistsRoute = require("./routes/playlists");
// const usersRoute = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

// const PORT = 5000;
const PORT = process.env.PORT || 5000;


// Home API
app.get("/", (req, res) => {
    res.send("Welcome to MusicUniverse API 🚀");
});

// Songs Route
app.use("/api/songs", songsRoute);

// Artists Route
app.use("/api/artists", artistsRoute);

// Albums Route
app.use("/api/albums", albumsRoute);   

app.use("/api/upload", uploadRoute);
// // Playlists Route
// app.use("/api/playlists", playlistsRoute);

// // Users Route
// app.use("/api/users", usersRoute);


// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});