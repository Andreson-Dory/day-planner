import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from "@/constant";

const initialState = {
    user: [],
    isLoadingTasks: false,
    errorLoadingTasks: false,
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_USER: 
            return {
                ...state,
                isLoadingTasks: true,
                errorLoadinTasks: false,
            };

        case GET_USER_SUCCESS: 
            return {
                ...state, 
                isLoadingTasks: false,
                user: action.payload
            };

        case GET_USER_ERROR:
            return {
                ...state,
                isLoadingTasks: false,
                errorLoadinTasks: true
            };

        default:
            return state;
    }
}