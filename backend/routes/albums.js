const express = require("express");

const router = express.Router();

const db = require("../config/firebase");


// ==========================================
// GET ALL ALBUMS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const snapshot = await db
            .collection("albums")
            .orderBy("createdAt", "desc")
            .get();

        const albums = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(albums);

    } catch (error) {

        console.error(
            "Failed to fetch albums:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch albums",
        });

    }

});


// ==========================================
// ADD NEW ALBUM
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            artist,
            imageUrl
        } = req.body;


        // Validation

        if (!name || !artist || !imageUrl) {

            return res.status(400).json({

                message:
                    "Album name, artist and image are required"

            });

        }


        // Save album to Firestore

        const album = await db
            .collection("albums")
            .add({

                name: name.trim(),

                artist: artist.trim(),

                imageUrl: imageUrl,

                createdAt: new Date(),

            });


        // Response

        res.status(201).json({

            message: "Album added successfully",

            album: {

                id: album.id,

                name: name.trim(),

                artist: artist.trim(),

                imageUrl: imageUrl,

            },

        });

    } catch (error) {

        console.error(
            "Failed to add album:",
            error
        );

        res.status(500).json({

            message: "Failed to add album",

        });

    }

});


module.exports = router;