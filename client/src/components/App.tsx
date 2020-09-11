import * as React from "react";
import { BrowserRouter, NavLink, Link, Switch, Route, Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import { Menu, Container, Button } from 'semantic-ui-react';
import Register from "./auth/Register";
import Login from "./auth/Login";
import { connect } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { SessionState } from "../redux/sessionStore/sessionReducer";
import Game from "./game/Game";
import Home from "./Home";
import axios, { AxiosResponse } from 'axios';
import { registerOnSocket, logoutUser, loginUser } from "../redux/sessionStore/sessionActions";
import processVariables from '../procVars'
import UserSession from "../redux/sessionStore/models/UserSession";

const { endpoint, serverUrl, mode } = processVariables

interface AppProps extends RouteComponentProps {
    sessionState: SessionState;
    loginUser: typeof loginUser
    logoutUser: typeof logoutUser
    registerOnSocket: typeof registerOnSocket

}
interface AppState {
    loggedIn: Boolean
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            loggedIn: this.props.sessionState.connected
        }

        const session = localStorage.getItem('session');

        if (session) {
            const sessionObject = JSON.parse(session);
            this.props.loginUser(sessionObject);

            this.state = { loggedIn: true }
        } else {
            axios.request<UserSession>({
                method: "GET",
                url: `${serverUrl}${endpoint}/auth/restore`,
                withCredentials: true
            }).then((res) => {
                if (res) {
                    this.props.loginUser(res.data);
                    this.props.registerOnSocket(res.data);
                    this.setState({ loggedIn: true });
                }
            }).catch((err) => { })

        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.logoutUser();
        axios.request({
            method: "GET",
            url: `${serverUrl}${endpoint}/auth/logout`,
            withCredentials: true
        }).then((res) => { }).catch((err) => { })

    }
    render() {
        return (
            <div className="App">
                <Menu size='large'>
                    <Container>
                        <Menu.Item >

                            Stamat
                                    </Menu.Item>
                        <Menu.Item >
                            <NavLink to={"/"}>Home</NavLink>
                        </Menu.Item>
                        <Menu.Item >
                            <NavLink to={"/game"}>Play</NavLink>
                        </Menu.Item>
                        <Menu.Item position='right'>
                            {this.state.loggedIn ?
                                <div>
                                    <Button as={Link} to={"/"} onClick={this.handleLogout} >Log Out</Button>

                                </div>
                                :
                                <div>
                                    <Button as={Link}
                                        to={"/login"} >Log in</Button>
                                    <Button as={Link} to={"/register"} primary={true} style={{ marginLeft: '0.5em' }}>Sign Up</Button>
                                </div>
                            }

                        </Menu.Item>
                    </Container>
                </Menu>
                <Switch>
                    <Route path="/login" render={() => <Login />} />
                    <Route path="/register" render={() => <Register />} />
                    <Route path="/game" render={() => <Game />} />
                    <Route path="/*" render={() => <Home />} />
                </Switch>
            </div>
        )
    }
}
const mapState = (state: RootState) => ({
    sessionState: state.session
})

const mapDispatch = {
    loginUser: loginUser,
    registerOnSocket: registerOnSocket,
    logoutUser: logoutUser
}


export default connect(mapState, mapDispatch)(withRouter(App))