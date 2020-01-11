import { observable, action } from 'mobx';

class SessionStore {
    @observable gameState = null;
    @observable userType = "guest";
    @observable sessionId = null;
    @observable username = null;
    @observable email = null;
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
    }
    @action loginUser = (user) => {
        this.userType = "user";
        this.loggedIn = true;
        this.sessionId = user.sessionId;
        this.username = user.username;
        this.email = user.email;
    }
}

export default new SessionStore();