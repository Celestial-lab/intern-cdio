import axios from "../axios";

const handleSignInApi = async(email, password) => {
    try {
        const response = await axios.post('/api/loginuser', {email, password});
        return response.data;
    } catch (error) {
        console.error('Sign in failed', error);
        return null;
    }
}

export default handleSignInApi;