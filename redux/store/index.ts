import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import { tasksReducer } from "../reducers/tasks";

export const store = createStore(
  combineReducers({
    tasks: tasksReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk)),
);

export type RootState = ReturnType<typeof store.getState>;
