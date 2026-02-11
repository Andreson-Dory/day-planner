import { GET_PLAN_TASKS, GET_PLAN_TASKS_ERROR, GET_PLAN_TASKS_SUCCESS, GET_TODAYS_TASKS, GET_TODAYS_TASKS_ERROR, GET_TODAYS_TASKS_SUCCESS, GET_WEEK_TASKS, GET_WEEK_TASKS_ERROR, GET_WEEK_TASKS_SUCCESS } from "@/constant/index";

const initialState = {
    todaysTasks: [{
            id: 1,
            title: "My first task",
            startTime: "09:00",
            endTime: "10:00",
            isCompleted: false,
            Date: new Date(2025, 0, 2, 9, 0)
        }, 
        {
           id: 2,
           title: "My second task",
           startTime: "10:00",
           endTime: "11:00",
           isCompleted: true,
           Date: new Date(2025, 0, 2, 10, 0)
        },
        {
            id: 3,
            title: "My third task",
            startTime: "11:00",
            endTime: "12:00",
            isCompleted: false,
            Date: new Date(2025, 0, 2, 11, 0)
        },
        {
            id: 4,
            title: "My fourth task",
            startTime: "12:00",
            endTime: "13:00",
            isCompleted: true,
            Date: new Date(2025, 0, 2, 12, 0)
        }],
    weekTasks: [{
            id: 1,
            title: "My first task",
            startTime: "09:00",
            endTime: "10:00",
            isCompleted: false,
            Date: new Date(2025, 0, 5, 9, 0)
        }, 
        {
           id: 2,
           title: "My second task",
           startTime: "10:00",
           endTime: "11:00",
           isCompleted: true,
           Date: new Date(2025, 0, 5, 10, 0)
        },
        {
            id: 3,
            title: "My third task",
            startTime: "11:00",
            endTime: "12:00",
            isCompleted: false,
            Date: new Date(2025, 0, 6, 11, 0)
        },
        {
            id: 4,
            title: "My fourth task",
            startTime: "12:00",
            endTime: "13:00",
            isCompleted: true,
            Date: new Date(2025, 0, 6, 12, 0)
        },   {
            id: 5,
            title: "My fifth task",
            startTime: "11:00",
            endTime: "12:00",
            isCompleted: false,
            Date: new Date(2025, 0, 7, 11, 0)
        },
        {
            id: 6,
            title: "My sixth task",
            startTime: "12:00",
            endTime: "13:00",
            isCompleted: true,
            Date: new Date(2025, 0, 7, 12, 0)
        }],
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