import {observable, action} from 'mobx';

class SessionStore {
    @observable gameState = null;
    @observable sessionId = null;
    @observable session = null;
    @action setGameState = (gameState) =>{
        this.gameState = gameState;
    }
    @action setSessionId = (sessionId) =>{
        this.sessionId = sessionId;
    }
}

export default new SessionStore();