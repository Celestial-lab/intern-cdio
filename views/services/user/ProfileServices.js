import axios from "../../axios";
// import instance from "../../axios";

const getProfileByEmail = async (email) => {
  try {
    const response = await axios.get(`/api/signupuser/${email}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  }
}

export default getProfileByEmail;