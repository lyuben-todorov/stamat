import { sessionReducer } from './sessionStore/sessionReducer';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { rootSocket } from './rootSocket';
import { matchReducer } from './matchStore/matchReducer';
import { clientStateReducer } from './clientStateStore/clientStateReducer';

const socketMiddleware = createSocketIoMiddleware(rootSocket, ["auth/", "server/"])
const rootReducer = combineReducers({
    session: sessionReducer,
    match: matchReducer,
    clientState: clientStateReducer
})

export type RootState = ReturnType<typeof rootReducer>

const RootStore = applyMiddleware(socketMiddleware)(createStore)(rootReducer);

export default RootStore