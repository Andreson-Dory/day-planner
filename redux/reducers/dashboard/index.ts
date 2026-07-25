import {
  GET_DASHBOARD_STATUS,
  GET_DASHBOARD_STATUS_ERROR,
  GET_DASHBOARD_STATUS_SUCCESS,
} from "@/constant";

const initialState = {
  status: {},
  uncompletedTasks: [],
  isLoadingDashboard: false,
  errorLoadingDashboard: false,
};

export const DashboardReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_DASHBOARD_STATUS:
      return {
        ...state,
        isLoadingDashboard: true,
        errorLoadingDashboard: false,
      };

    case GET_DASHBOARD_STATUS_SUCCESS:
      return {
        ...state,
        isLoadingDashboard: false,
        status: action.payload.status,
        uncompletedTasks: action.payload.uncompletedTasks,
      };

    case GET_DASHBOARD_STATUS_ERROR:
      return {
        ...state,
        isLoadingDashboard: false,
        errorLoadingDashboard: true,
      };

    default:
      return state;
  }
};
