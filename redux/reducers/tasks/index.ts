import { GET_PLAN_TASKS, GET_PLAN_TASKS_ERROR, GET_PLAN_TASKS_SUCCESS, GET_TODAYS_TASKS, GET_TODAYS_TASKS_ERROR, GET_TODAYS_TASKS_SUCCESS, GET_WEEK_TASKS, GET_WEEK_TASKS_ERROR, GET_WEEK_TASKS_SUCCESS } from "@/constant/index";

const initialState = {
    todaysTasks: [],
    weekTasks: [],
    planTasks: [], 
    isLoadingTasks: false,
    errorLoadingTasks: false,
}

export const tasksReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_TODAYS_TASKS: 
            return {
                ...state,
                isLoadingTasks: true,
                errorLoadinTasks: false,
            };

        case GET_TODAYS_TASKS_SUCCESS: 
            return {
                ...state, 
                isLoadingTasks: false,
                todaysTasks: action.payload
            };

        case GET_TODAYS_TASKS_ERROR:
            return {
                ...state,
                isLoadingTasks: false,
                errorLoadinTasks: true
            };

        case GET_WEEK_TASKS:
            return {
                ...state,
                isLoadingTasks: true,
                errorLoadinTasks: false,
            };

        case GET_WEEK_TASKS_SUCCESS:
            return {
                ...state, 
                isLoadingTasks: false,
                weekTasks: action.payload
            };

        case GET_WEEK_TASKS_ERROR: 
            return {
                ...state,
                isLoadingTasks: false,
                errorLoadinTasks: true
            };

        case GET_PLAN_TASKS:
            return {
                ...state,
                isLoadingTasks: true,
                errorLoadinTasks: false,
            };

        case GET_PLAN_TASKS_SUCCESS:
            return {
                ...state, 
                isLoadingTasks: false,
                planTasks: action.payload
            };

        case GET_PLAN_TASKS_ERROR:
            return {
                ...state,
                isLoadingTasks: false,
                errorLoadinTasks: true
            }

        default:
            return state;
    }
}