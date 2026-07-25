import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import { tasksReducer } from "../reducers/tasks";
import { DashboardReducer } from "../reducers/dashboard";

export const store = createStore(
  combineReducers({
    tasks: tasksReducer,
    dashboard: DashboardReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk)),
);

export type RootState = ReturnType<typeof store.getState>;
