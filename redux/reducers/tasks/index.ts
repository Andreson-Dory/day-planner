import RepetitiveTask from "@/app/repetitive-task";
import {
  GET_PLAN_TASKS,
  GET_PLAN_TASKS_ERROR,
  GET_PLAN_TASKS_SUCCESS,
  GET_DAILY_TASKS,
  GET_DAILY_TASKS_ERROR,
  GET_DAILY_TASKS_SUCCESS,
  GET_WEEK_TASKS,
  GET_WEEK_TASKS_ERROR,
  GET_WEEK_TASKS_SUCCESS,
  GET_REPETITIVE_TASKS,
  GET_REPETITIVE_TASKS_SUCCESS,
  GET_REPETITIVE_TASKS_ERROR,
} from "@/constant/index";

const initialState = {
  dailyTasks: [],
  weekTasks: [],
  planTasks: [],
  repetitiveTasks: [],
  isLoadingTasks: false,
  errorLoadingTasks: false,
};

export const tasksReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_DAILY_TASKS:
      return {
        ...state,
        isLoadingTasks: true,
        errorLoadinTasks: false,
      };

    case GET_DAILY_TASKS_SUCCESS:
      return {
        ...state,
        isLoadingTasks: false,
        dailyTasks: action.payload,
      };

    case GET_DAILY_TASKS_ERROR:
      return {
        ...state,
        isLoadingTasks: false,
        errorLoadinTasks: true,
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
        weekTasks: action.payload,
      };

    case GET_WEEK_TASKS_ERROR:
      return {
        ...state,
        isLoadingTasks: false,
        errorLoadinTasks: true,
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
        planTasks: action.payload,
      };

    case GET_PLAN_TASKS_ERROR:
      return {
        ...state,
        isLoadingTasks: false,
        errorLoadinTasks: true,
      };

    case GET_REPETITIVE_TASKS:
      return {
        ...state,
        isLoadingTasks: true,
        errorLoadinTasks: false,
      };

    case GET_REPETITIVE_TASKS_SUCCESS:
      return {
        ...state,
        isLoadingTasks: false,
        repetitiveTasks: action.payload,
      };

    case GET_REPETITIVE_TASKS_ERROR:
      return {
        ...state,
        isLoadingTasks: false,
        errorLoadinTasks: true,
      };

    default:
      return state;
  }
};
