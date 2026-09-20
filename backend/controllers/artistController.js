console.log("🔥 artistController loaded");

const cloudinary = require("../config/cloudinary");
const db = require("../config/firebase");

// =====================================================
// GET ALL ARTISTS
// =====================================================

const getArtists = async (req, res) => {

    try {

        const snapshot = await db
            .collection("artists")
            .get();

        const artists = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(artists);

    } catch (error) {

        console.error("Get artists error:", error);

        res.status(500).json({
            message: "Failed to get artists",
        });

    }

};


// =====================================================
// ADD ARTIST
// =====================================================

const addArtist = async (req, res) => {

    try {

        console.log("Artist upload request received");

        const { name } = req.body;

        if (!name) {

            return res.status(400).json({
                message: "Artist name is required",
            });

        }

        if (!req.file) {

            return res.status(400).json({
                message: "Artist image is required",
            });

        }


        // =================================================
        // CHECK DUPLICATE ARTIST
        // =================================================

        const existingArtist = await db
            .collection("artists")
            .where("name", "==", name.trim())
            .get();

        if (!existingArtist.empty) {

            return res.status(409).json({
                message: "Artist already exists",
            });

        }


        // =================================================
        // UPLOAD IMAGE TO CLOUDINARY
        // =================================================

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "MusicUniverse/artists",
            }
        );


        // =================================================
        // SAVE ARTIST TO FIREBASE
        // =================================================

        const artist = {

            name: name.trim(),

            imageUrl: result.secure_url,

            createdAt: new Date(),

        };


        const docRef = await db
            .collection("artists")
            .add(artist);


        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            message: "Artist added successfully!",

            artist: {

                id: docRef.id,

                ...artist,

            },

        });

    } catch (error) {

        console.error("Artist upload error:", error);

        res.status(500).json({

            message: "Artist upload failed",

            error: error.message,

        });

    }

};


module.exports = {

    getArtists,
    addArtist,

};