import { SET_AUTH_INFO, CLEAR_AUTH_INFO } from '@/views/store/context/authReducer';

export const setAuthInfor = (dispatch, email, role) => {
    console.log('giá trị context trong hàm login: ', email, role);
    dispatch({
        type: SET_AUTH_INFO,
        payload: { email, role },
    });
};


export const clearAuthInfor = (dispatch) => {
    dispatch({ 
        type: CLEAR_AUTH_INFO
    })
};