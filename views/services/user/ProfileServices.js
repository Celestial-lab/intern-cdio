import axios from "../../axios";

export const getProfileByEmail = async (email) => {
  try {
    const response = await axios.get(`/api/profileuser/${email}`);
    return response.data;
    
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}

export const editProfileById = async (id, data) => {
  try {
    console.log('Data sent:', data); 
    const response = await axios.put(`/api/profileuser/${id}`, data);
    console.log('Returned data:', response.data);
    return response.data;
  }
  catch (error) {
    console.error('Data error', error);
    return null;
  }
}