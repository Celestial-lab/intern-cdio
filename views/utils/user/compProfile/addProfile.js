'use client'

import React from "react"
import { addCreateInfor } from '@/views/services/user/ProfileServices';
import { message } from "antd";

export const handleAddProfile = async(form, updateProfile, profile) => {
    try {
        const values = await form.validateFields();
        const userId = localStorage.getItem('userId');
        console.log('values trước khi chạy updated: ', values);
        const addInfor = {
          fullname: values.fullName,
          dateOfBirth: values.dateOfBirth.toISOString(),
          gender: values.gender,
          country: values.country,
          walletAddress: values.walletAddress,
          loginId: userId,
        };
        const response = await addCreateInfor(addInfor);
        console.log('response bên frontend: ', response);
        if (response) {
          updateProfile({ ...profile, ...addInfor, gender: values.gender });
          message.success('Profile updated successfully!');
        } else {
          message.error('Failed to update profile!');
        };
      } catch (error) {
        console.error('Error updating profile:', error);
        message.error('Failed to update profile!');
    }
}