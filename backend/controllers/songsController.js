const db = require("../config/firebase");

const getSongs = async (req, res) => {

    try {

        const snapshot = await db.collection("songs").get();

        const songs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(songs);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Error fetching songs"
        });

    }

};

module.exports = {
    getSongs,
};