const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    uploadImage,
    uploadSong,
} = require("../controllers/uploadController");


// =====================================================
// UPLOAD ONLY IMAGE
// =====================================================

router.post(
    "/image",
    upload.single("image"),
    uploadImage
);


// =====================================================
// UPLOAD COMPLETE SONG
// =====================================================

router.post(
    "/song",
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
        {
            name: "audioFile",
            maxCount: 1,
        },
    ]),
    uploadSong
);


module.exports = router;