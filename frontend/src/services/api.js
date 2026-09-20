// const API_URL = "http://10.11.37.135:5000";
const API_URL = "http://localhost:5000";


export const getSongs = async () => {
    const response = await fetch(`${API_URL}/api/songs`);

    if (!response.ok) {
        throw new Error("Failed to fetch songs");
    }

    return response.json();
};

export const getArtists = async () => {
    const response = await fetch(`${API_URL}/api/artists`);

    if (!response.ok) {
        throw new Error("Failed to fetch artists");
    }

    return response.json();
};
export const getAlbums = async () => {
    const response = await fetch(`${API_URL}/api/albums`);

    if (!response.ok) {
        throw new Error("Failed to fetch albums");
    }

    return response.json();
};