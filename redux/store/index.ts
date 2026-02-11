import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { tasksReducer } from '../reducers/tasks';
import { thunk } from 'redux-thunk';


export const store = createStore(
  combineReducers({
    tasks : tasksReducer,
  }),  
  composeWithDevTools(
    applyMiddleware(thunk)
  ),
);

export type RootState = ReturnType<typeof store.getState>;