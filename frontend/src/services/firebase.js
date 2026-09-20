// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBL8IvrQe6qVFYIV2lz78WCl3U86alc7XY",
//   authDomain: "musicuniverse-580e1.firebaseapp.com",
//   projectId: "musicuniverse-580e1",
//   storageBucket: "musicuniverse-580e1.firebasestorage.app",
//   messagingSenderId: "548934238661",
//   appId: "1:548934238661:web:605f3e88152553f8a84bac"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL8IvrQe6qVFYIV2lz78WCl3U86alc7XY",
  authDomain: "musicuniverse-580e1.firebaseapp.com",
  projectId: "musicuniverse-580e1",
  storageBucket: "musicuniverse-580e1.firebasestorage.app",
  messagingSenderId: "548934238661",
  appId: "1:548934238661:web:605f3e88152553f8a84bac"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);