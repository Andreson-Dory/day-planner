import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { tasksReducer } from '../reducers/tasks';
import { thunk } from 'redux-thunk';
import { userReducer } from '../reducers/user';


export const store = createStore(
  combineReducers({
    tasks : tasksReducer,
    user : userReducer
  }),  
  composeWithDevTools(
    applyMiddleware(thunk)
  ),
);

export type RootState = ReturnType<typeof store.getState>;