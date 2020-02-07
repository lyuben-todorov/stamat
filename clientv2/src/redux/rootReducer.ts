import { sessionReducer } from './sessionStore/sessionReducer';
import { combineReducers, createStore } from 'redux';

const rootReducer = combineReducers({
    session: sessionReducer
})

export type RootState = ReturnType<typeof rootReducer>

const RootStore = createStore(rootReducer);

export default RootStore