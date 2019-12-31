import {observable, action} from 'mobx';

class GameStore {
    @observable gameId = null;
    @action initiate = (gameId) =>{
        this.gameId = gameId;
    }
}

export default new GameStore();