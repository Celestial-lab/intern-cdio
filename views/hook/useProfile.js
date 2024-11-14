'use client'

import { useState } from "react";

export const useProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        fullname: '',
        dateofbirth: '',
        gender: '',
        country: '',
        walletAddress: '',
    });
    const updateProfile = (newProfileData) => {
        setProfile(prevProfile => ({
          ...prevProfile,
          ...newProfileData,
        }));
      };
    
      return [profile, updateProfile];
}