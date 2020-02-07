import {sessionReducer} from './sessionStore/sessionReducer';


const rootReducer = combineReducers({
    session:sessionReducer
})