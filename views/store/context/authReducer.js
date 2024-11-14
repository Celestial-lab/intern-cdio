
export const ACTION_SET_EMAIL_ROLE = 'ACTION_SET_EMAIL_ROLE';
export const ACTION_CLEAR_EMAIL_ROLE = 'ACTION_CLEAR_EMAIL_ROLE';

export const authReducer = (state, action) => {
    switch (action.type) {
        case ACTION_SET_EMAIL_ROLE:
            const updatedState = {
                ...state,
                email: action.payload.email,
                role: action.payload.role,
            };
            return updatedState;
        case ACTION_CLEAR_EMAIL_ROLE:
            return {
                ...state,
                email: null,
                role: null,
            };
        default:
            return state; 
    }
}