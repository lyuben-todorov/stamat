import React, { Component } from 'react'
import './_sass/App.scss';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios';
import sessionStore from '../Mobx/SessionStore';
import { Menu, Container, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Game from './Game/Game';
import SessionStore from '../Mobx/SessionStore';
import Dashboard from './Auth/Dashboard';


@observer
class App extends Component {

        render() {
                return (
                        <div className="App">
                                <BrowserRouter>
                                        <Menu size='large'>
                                                <Container>
                                                        <Menu.Item header >Ebre-debre</Menu.Item>
                                                        <Menu.Item as='a' active>Home</Menu.Item>
                                                        <Menu.Item as='a'href="/game" >Game</Menu.Item>
                                                        <Menu.Item position='right'>
                                                                <Button as={Link} to={"/login"} >Log in</Button>
                                                                <Button as={Link} to={"/register"} primary={true} style={{ marginLeft: '0.5em' }}>Sign Up</Button>
                                                        </Menu.Item>
                                                </Container>
                                        </Menu>
                                        <Switch>
                                                <Route path="/login" render={() => <Login sessionStore={sessionStore} />} />
                                                <Route path="/register" render={() => <Register sessionStore={sessionStore} />} />
                                                <Route path="/game" render={() => <Game sessionStore={SessionStore} />} />                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore} />} />
                                                <Route path="/profile*" render={() => <Dashboard sessionStore={SessionStore} />} />                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore} />} />

                                        </Switch>
                                </BrowserRouter>
                        </div>
                )
        }
}

export default App