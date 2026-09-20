// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: "ekgeesvf",
//     api_key: "569816769279535",
//     api_secret: "7X1-fbjbehWs4--_cR6Jkj2YuvU",
// });

// module.exports = cloudinary;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;