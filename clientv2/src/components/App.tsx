import * as React from "react";
import { BrowserRouter, NavLink, Link, Switch, Route, Redirect } from "react-router-dom";
import { Menu, Container, Button } from 'semantic-ui-react';
import Register from "./auth/Register";
import Login from "./auth/Login";
import { connect } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { SessionState } from "../redux/sessionStore/sessionTypes";
import { Game } from "./game/Game";
import { Home } from "./Home";
import processVariables from '../procVars'
import axios from 'axios';
import { loginUser, logoutUser } from "../redux/sessionStore/sessionActions";

const { endpoint, serverUrl, mode } = processVariables

export interface AppProps {
    sessionState: SessionState;
    loginUser?: Function
    logoutUser?: Function

}
export interface AppState {
    loggedIn: Boolean
}
const mapState = (state: RootState) => ({
    sessionState: state.session
})

const mapDispatch = {
    loginUser: loginUser,
    logoutUsr: logoutUser
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        const sessionId = localStorage.getItem('sessionId');

        this.state = {
            loggedIn: false
        }

        if (sessionId) {
            axios.get(`${serverUrl}${endpoint}/auth/restore`, { withCredentials: true }).then((res) => {
                this.props.loginUser(res.data)
            })
            this.state = { loggedIn: true }
        }

    }

    handleLogout() {
        this.props.logoutUser();
    }
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Menu size='large'>
                        <Container>
                            <Menu.Item >

                                Stamat
                                    </Menu.Item>
                            <Menu.Item >
                                <NavLink to={"/"}>Home</NavLink>
                            </Menu.Item>
                            <Menu.Item >

                                <NavLink to={"/game"}>Game</NavLink>
                            </Menu.Item>
                            <Menu.Item position='right'>
                                {this.props.sessionState.loggedIn ?
                                    <div>
                                        <Button as={Link} to={"/"} onClick={this.handleLogout} >Log Out</Button>

                                    </div>
                                    :
                                    <div>
                                        <Button as={Link} to={"/login"} >Log in</Button>
                                        <Button as={Link} to={"/register"} primary={true} style={{ marginLeft: '0.5em' }}>Sign Up</Button>
                                    </div>
                                }

                            </Menu.Item>
                        </Container>
                    </Menu>
                    <Switch>
                        <Route path="/login" render={() => <Login />} />
                        <Route path="/register" render={() => <Register />} />
                        <Route path="/game" render={() =>
                            this.props.sessionState.loggedIn ?
                                <Game > </Game>
                                :
                                <Redirect to={"/login"}></Redirect>
                        } />
                        <Route path="/" render={() => <Home />} />

                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}


export default connect(
    mapState,
    mapDispatch
)(App)