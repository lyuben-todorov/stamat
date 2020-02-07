import * as React from "react";
import { BrowserRouter, NavLink, Link, Switch, Route, Redirect } from "react-router-dom";
import { Menu, Container, Button } from 'semantic-ui-react';
import Register from "./auth/Register";
import Login from "./auth/Login";
import { connect } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { SessionState } from "../redux/sessionStore/sessionTypes";


export interface AppProps {
    sessionState: SessionState;

}
export interface AppState {

}
const mapState = (state: RootState) => ({
    sessionState: state.session
})

const mapDispatch = {
    toggleOn: () => ({ type: 'TOGGLE_IS_ON' })
}

class App extends React.Component<AppProps, AppState> {
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
                                {this.props.loggedIn ?
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
                            this.props.loggedIn ?
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


export default connect<AppProps, AppState>(
    mapState,
    mapDispatch
)(App)