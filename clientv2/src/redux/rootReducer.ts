import { sessionReducer } from './sessionStore/sessionReducer';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { rootSocket } from './rootSocket';

const socketMiddleware = createSocketIoMiddleware(rootSocket, ["auth/"])
const rootReducer = combineReducers({
    session: sessionReducer
})

export type RootState = ReturnType<typeof rootReducer>

const RootStore = applyMiddleware(socketMiddleware)(createStore)(rootReducer);

export default RootStore