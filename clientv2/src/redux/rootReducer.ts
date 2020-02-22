import { sessionReducer } from './sessionStore/sessionReducer';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { rootSocket } from './rootSocket';
import { matchReducer } from './matchStore/matchReducer';

const socketMiddleware = createSocketIoMiddleware(rootSocket, ["auth/", "client/"])
const rootReducer = combineReducers({
    session: sessionReducer,
    match: matchReducer
})

export type RootState = ReturnType<typeof rootReducer>

const RootStore = applyMiddleware(socketMiddleware)(createStore)(rootReducer);

export default RootStore