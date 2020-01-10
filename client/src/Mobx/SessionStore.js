import {observable, action} from 'mobx';

class SessionStore {
    @observable gameState = null;
    @observable session = null;
    @action setGameState = (gameState) =>{
        this.gameState = gameState;
    }
}

export default new SessionStore();