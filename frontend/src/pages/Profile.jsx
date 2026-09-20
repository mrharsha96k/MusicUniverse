import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../services/firebase";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    bio: "",
    phone: "",
    country: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...userSnap.data()
          }));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);
      setMessage("");

      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          ...profile,
          email: user.email,
          uid: user.uid,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-header">

        <div className="profile-large-avatar">
          {(
            profile.fullName ||
            profile.username ||
            user.email
          )
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <span className="profile-label">
            MUSICUNIVERSE ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>{user.email}</p>
        </div>

      </div>


      <div className="profile-info-card">

        <h2>Personal Information</h2>

        <form onSubmit={handleSave}>

          <div className="profile-form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={profile.fullName}
              onChange={handleChange}
            />
          </div>


          <div className="profile-form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={profile.username}
              onChange={handleChange}
            />
          </div>


          <div className="profile-form-group">
            <label>Bio</label>

            <textarea
              name="bio"
              placeholder="Tell something about yourself..."
              value={profile.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>


          <div className="profile-form-row">

            <div className="profile-form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>


            <div className="profile-form-group">
              <label>Country</label>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={profile.country}
                onChange={handleChange}
              />
            </div>

          </div>


          {message && (
            <p className="profile-message">
              {message}
            </p>
          )}


          <button
            type="submit"
            className="save-profile-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>

      </div>


      <div className="profile-info-card account-card">

        <h2>Account Information</h2>

        <div className="profile-info-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-info-row">
          <span>User ID</span>
          <strong>{user.uid}</strong>
        </div>

      </div>

    </div>
  );
};

export default Profile;