// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import Avatar from '../assets/avatars.png'; // Default avatar image

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({ name: "Name", imageUrl: Avatar });

  useEffect(() => {
    const token = localStorage.getItem("googleAuthToken");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      setUserProfile({ name: data.name, imageUrl: data.picture });
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
