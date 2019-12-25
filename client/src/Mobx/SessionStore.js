import {observable, action} from 'mobx';

class SessionStore {
    @observable loggedIn = false;
    @observable session = null;
    @action login = (session) =>{
        this.session = session;
        this.loggedIn = true;
    }
    @action logout = () =>{
        this.session = null
        this.loggedIn = false;
    }
}

export default new SessionStore();