import React, { Component } from 'react'
import './_sass/App.scss';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Game from './Game/Game';
import SessionStore from '../Mobx/SessionStore';
import Dashboard from './Auth/Dashboard';
import axios from 'axios';
import { serverURI } from '../processVariables'

@observer
class App extends Component {
        constructor(props) {
                super(props);

                const sessionId = localStorage.getItem('sessionId');
                if (sessionId) {
                        this.props.sessionStore.setSessionId(sessionId);
                }
                axios.get(`http://${serverURI}/auth/restore`, { withCredentials: true }).then((res) => {
                        this.props.sessionStore.loginUser(res.data)
                })
                this.handleLogout = this.handleLogout.bind(this);
        }

        handleLogout() {
                axios.get(`http://${serverURI}/auth/logout`, { withCredentials: true }).then((res)=>{
                        this.props.sessionStore.logout();
                })
        }
        render() {
                return (
                        <div className="App">
                                <BrowserRouter>
                                        <Menu size='large'>
                                                <Container>
                                                        <Menu.Item header >Ebre-debre</Menu.Item>
                                                        <Menu.Item as='a' active>Home</Menu.Item>
                                                        <Menu.Item as='a' href="/game" >Game</Menu.Item>
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
                                                <Route path="/game" render={() => <Game sessionStore={SessionStore} />} />                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore} />} />
                                                <Route path="/profile*" render={() => <Dashboard sessionStore={SessionStore} />} />                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore} />} />

                                        </Switch>
                                </BrowserRouter>
                        </div>
                )
        }
}

export default App