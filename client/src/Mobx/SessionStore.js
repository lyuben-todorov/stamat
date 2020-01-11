import { observable, action, computed } from 'mobx';

class SessionStore {
    @observable gameState = null;
    @observable userType = "guest";

    @observable sessionId = null;

    @observable username = null;
    @observable email = null;
    @observable userId = null;

    @observable loggedIn = false;
    @observable opponentName = null;
    @action setGameState = (gameState) => {
        this.gameState = gameState;
    }
    @action setSessionId = (sessionId) => {
        this.sessionId = sessionId;
    }
    @action logout = ()=>{
        this.userType="guest";
        this.loggedIn= false;
        this.sessionId = null;
        this.username = null;
        this.email = null;
        this.userId = null;
    }
    @action loginUser = (user) => {
        this.userType = "user";
        this.loggedIn = true;
        this.sessionId = user.sessionId;
        this.username = user.username;
        this.email = user.email;
        this.userId = user.id;
    }
    @computed get getUserType(){
        return this.userType;
    }
}

export default new SessionStore();