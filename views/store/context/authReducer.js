
export const SET_AUTH_INFO = 'set auth infor';
export const CLEAR_AUTH_INFO = 'clear auth infor';

export const authReducer = (state, actions) => {
    switch (actions.type) {
        case SET_AUTH_INFO:
            return {
                ...state,
                email: actions.payload.email,
                role: actions.payload.role,
            };
        case CLEAR_AUTH_INFO:
            return {
                ...state,
                email: null,
                role: null,
            };
        default:
            return state; 
    }
}