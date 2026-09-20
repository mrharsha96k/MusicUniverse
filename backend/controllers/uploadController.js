console.log("🔥 uploadController loaded");

const cloudinary = require("../config/cloudinary");
const db = require("../config/firebase");
const fs = require("fs");

// =====================================================
// UPLOAD IMAGE
// =====================================================

const uploadImage = async (req, res) => {
    try {

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "MusicUniverse/artists",
            }
        );

        // Delete temporary local file
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Failed to delete temp image:", err);
            }
        });

        res.json({
            message: "Image uploaded successfully!",
            imageUrl: result.secure_url,
        });

    } catch (error) {

        console.error(error);

        // Cleanup if upload fails
        if (req.file?.path) {
            fs.unlink(req.file.path, () => {});
        }

        res.status(500).json({
            message: "Upload failed",
        });
    }
};


// =====================================================
// UPLOAD SONG
// =====================================================

const uploadSong = async (req, res) => {
    try {

        // Upload Cover Image
        const cover = await cloudinary.uploader.upload(
            req.files.coverImage[0].path,
            {
                folder: "MusicUniverse/covers",
            }
        );

        // Upload MP3
        const song = await cloudinary.uploader.upload(
            req.files.audioFile[0].path,
            {
                resource_type: "video",
                folder: "MusicUniverse/songs",
            }
        );

        // Save song in Firebase
        await db.collection("songs").add({

            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            duration: req.body.duration,

            coverUrl: cover.secure_url,
            songUrl: song.secure_url,

            createdAt: new Date(),

        });

        // Delete temporary cover
        fs.unlink(
            req.files.coverImage[0].path,
            (err) => {
                if (err) {
                    console.error(
                        "Failed to delete cover:",
                        err
                    );
                }
            }
        );

        // Delete temporary audio
        fs.unlink(
            req.files.audioFile[0].path,
            (err) => {
                if (err) {
                    console.error(
                        "Failed to delete audio:",
                        err
                    );
                }
            }
        );

        res.json({
            message: "Song uploaded successfully!",
            coverUrl: cover.secure_url,
            songUrl: song.secure_url,
            data: req.body,
        });

    } catch (error) {

        console.error(error);

        // Cleanup cover if something fails
        if (req.files?.coverImage?.[0]?.path) {
            fs.unlink(
                req.files.coverImage[0].path,
                () => {}
            );
        }

        // Cleanup audio if something fails
        if (req.files?.audioFile?.[0]?.path) {
            fs.unlink(
                req.files.audioFile[0].path,
                () => {}
            );
        }

        res.status(500).json({
            message: "Upload Failed",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    uploadImage,
    uploadSong,
};