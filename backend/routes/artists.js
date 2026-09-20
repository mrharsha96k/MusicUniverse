const express = require("express");
const db = require("../config/firebase");

const router = express.Router();


// GET ALL ARTISTS
router.get("/", async (req, res) => {

    try {

        const snapshot = await db
            .collection("artists")
            .orderBy("createdAt", "desc")
            .get();

        const artists = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(artists);

    } catch (error) {

        console.error("Failed to get artists:", error);

        res.status(500).json({
            message: "Failed to get artists"
        });

    }

});


// ADD NEW ARTIST
router.post("/", async (req, res) => {

    try {

        const { name, imageUrl } = req.body;

        if (!name || !imageUrl) {

            return res.status(400).json({
                message: "Artist name and image are required"
            });

        }


        const artist = await db.collection("artists").add({

            name: name.trim(),

            imageUrl: imageUrl,

            createdAt: new Date()

        });


        res.status(201).json({

            message: "Artist added successfully",

            artist: {
                id: artist.id,
                name: name.trim(),
                imageUrl: imageUrl
            }

        });

    } catch (error) {

        console.error("Failed to add artist:", error);

        res.status(500).json({

            message: "Failed to add artist"

        });

    }

});


module.exports = router;