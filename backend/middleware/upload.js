const multer = require("multer");
const os = require("os");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(os.tmpdir(), "musicuniverse-uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;