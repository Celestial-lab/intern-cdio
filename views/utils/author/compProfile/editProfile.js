'use client'

import { message } from 'antd';
import { editInforById } from '@/views/services/user/ProfileServices';

export const handleEditProfile = async(form, updateProfile, profile) => {
    try {
        const values = await form.validateFields();
  
        const inforId = localStorage.getItem('inforId');
  
        const updatedProfile = {
          fullname: values.fullName,
          dateofbirth: values.dateOfBirth,
          gender: values.gender,
          country: values.country,
          walletAddress: values.walletAddress,
        };
  
        console.log('values sau khi nhập vào updated: ', updatedProfile);
  
        const response = await editInforById(inforId, updatedProfile);
  
        console.log('response trả về sau edit: ', response);
  
        if (response) {
          updateProfile(updatedProfile);
          message.success('Profile updated successfully!');
        } else {
          message.error('Failed to update profile!');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        message.error('Failed to update profile!');
      }
}