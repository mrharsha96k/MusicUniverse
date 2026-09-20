// const { initializeApp, cert } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// const serviceAccount = require("./firebase-service-account.json");

// initializeApp({
//     credential: cert(serviceAccount),
// });

// const db = getFirestore();

// module.exports = db;
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = JSON.parse(
    Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
    ).toString("utf8")
);

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = db;