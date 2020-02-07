import { sessionReducer } from './sessionStore/sessionReducer';

import { combineReducers } from 'redux';
const rootReducer = combineReducers({
    session: sessionReducer
})

export type RootState = ReturnType<typeof rootReducer>