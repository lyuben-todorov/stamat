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
import axios, { AxiosResponse } from 'axios';
import { loginUser, logoutUser } from "../redux/sessionStore/sessionActions";
import processVariables from '../procVars'

const { endpoint, serverUrl, mode } = processVariables

interface AppProps {
    sessionState: SessionState;
    loginUser?: Function
    logoutUser?: Function

}
interface AppState {
    loggedIn: Boolean
}
const mapState = (state: RootState) => ({
    sessionState: state.session
})

const mapDispatch = {
    loginUser: loginUser,
    logoutUser: logoutUser
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            loggedIn: false
        }

        const session = localStorage.getItem('session');

        if (session) {
            const sessionObject = JSON.parse(session);
            this.props.loginUser(sessionObject);

            this.state = { loggedIn: true }
        } else {
            axios.request<AxiosResponse>({
                method: "GET",
                url: `${serverUrl}${endpoint}/auth/restore`,
                withCredentials: true,

            }).then((res) => {
                console.log(res.data)
                if (res) this.props.loginUser(res.data)   
            }).catch((err) => {
                
            })


        }

    }

    handleLogout() {
        this.props.logoutUser();
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

                                <NavLink to={"/game"}>Game</NavLink>
                            </Menu.Item>
                            <Menu.Item position='right'>
                                {this.props.sessionState.connected ?
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
                        <Route path="/game" render={() =>
                            this.props.sessionState.connected ?
                                <Game > </Game>
                                :
                                <Redirect to={"/login"}></Redirect>
                        } />
                        <Route path="/" render={() => <Home />} />

                    </Switch>
            </div>
        )
    }
}


export default connect(
    mapState,
    mapDispatch
)(App)