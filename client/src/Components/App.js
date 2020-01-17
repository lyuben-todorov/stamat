import React, { Component } from 'react'
import './_sass/App.scss';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Switch, Route, Link, NavLink } from 'react-router-dom'
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Provider } from 'react-redux'
import Game from './Game/Game';
import SessionStore from '../Mobx/SessionStore';
import axios from 'axios';
import { serverUrl } from '../processVariables'
import io from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../redux/gameState'
import { Stamat } from './Stamat';
import Home from './Home';

function returnStore(sessionId) {
        let connectionString = `http://stamat.me/?session=${sessionId}`;
        let socket = io(connectionString, {path:"/api/socket"});


        let socketMiddleware = createSocketIoMiddleware(socket, ["server/", "game/"]);
        let gameStore = applyMiddleware(socketMiddleware)(createStore)(reducer);
        return gameStore
}
@observer
class App extends Component {
        constructor(props) {
                super(props);

                this.state = {loggedIn:false};

                const sessionId = localStorage.getItem('sessionId');

                if (sessionId) {
                        axios.get(`${serverUrl}/auth/restore`, { withCredentials: true }).then((res) => {

                                this.props.sessionStore.loginUser(res.data)
                        })
                        this.state = {loggedIn:true}
                }


                this.handleLogout = this.handleLogout.bind(this);


        }
        componentDidUpdate(prevProps) {
                if (this.props !== prevProps) {
                }
        }

        handleLogout() {
                axios.get(`${serverUrl}/auth/logout`, { withCredentials: true }).then((res) => {
                        localStorage.removeItem('sessionId')
                        this.props.sessionStore.logout();
                })
        }
        render() {
                return (

                        <Provider store={returnStore(this.props.sessionStore.sessionId)}>
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
                                                                        {this.props.sessionStore.loggedIn ?
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
                                                <Route path="/login" render={() => <Login sessionStore={SessionStore} />} />
                                                <Route path="/register" render={() => <Register sessionStore={SessionStore} />} />
                                                <Route path="/game" render={() => <Stamat loggedIn={this.state.loggedIn} sessionStore={SessionStore} />} />                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore} />} />
                                                <Route path="/" render={() => <Home sessionStore={SessionStore} />} />

                                                </Switch>
                                        </BrowserRouter>
                                </div>

                        </Provider>
                )
        }
}

export default App
