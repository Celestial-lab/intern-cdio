import axios from '../axios';

const handleSignUpApi = async( email, password, role) => {
    console.log('bên api', { email, password, role });
    return axios.post('/api/register', { email, password, role })
        .then(response => response.data) 
        .catch(error => {
            console.error('Sign Up API error:', error.response || error.message);
            throw error;
        });
};
 
export default handleSignUpApi;

