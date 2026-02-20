import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from "@/constant";

const initialState = {
    user: [],
    isLoadingUser: true,
    errorLoadingUser: false,
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_USER: 
            return {
                ...state,
                isLoadingUser: true,
                errorLoadingUser: false,
            };

        case GET_USER_SUCCESS: 
            return {
                ...state, 
                isLoadingUser: false,
                user: action.payload
            };

        case GET_USER_ERROR:
            return {
                ...state,
                isLoadingUser: false,
                errorLoadingUser: true
            };

        default:
            return state;
    }
}