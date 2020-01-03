import React, { Component } from 'react'
import './_sass/App.scss';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios';
import sessionStore from '../Mobx/SessionStore';
import { Segment, Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Cookies, withCookies } from 'react-cookie';
import { instanceOf } from 'prop-types'
import Game from './Game/Game';
import SessionStore from '../Mobx/SessionStore';

const root = "http://localhost:3001/auth";

@observer
class App extends Component {
        static propTypes = {
                cookies: instanceOf(Cookies).isRequired
        }
        constructor(props) {
                super(props);

                const { cookies } = props;

                this.state = {
                        sessionToken: cookies.get('token',{doNotParse:true})
                };
                this.handleLogout = this.handleLogout.bind(this);
        }



        componentDidMount() {
                console.log(this.state.sessionToken)
                if (this.state.sessionToken) {
                        this.props.store.login(this.state.sessionToken);
                } else {
                        this.props.store.logout();
                }
        }

        handleLogout() {

                axios.get(root + "/logout").catch((err) => {
                        console.log(err);
                }).then(() => {
                        this.props.store.logout();
                })
        }
        render() {

                return (
                        <div className="App">
                                <BrowserRouter>
                                        <Segment>

                                                <Header size="huge">Ebre-debre</Header>

                                        </Segment>
                                        <Switch>
                                                <Route path="/login" render={() => <Login sessionStore={sessionStore} />} />
                                                <Route path="/register" render={() => <Register sessionStore={sessionStore} />} />
                                                <Route path="/game*" render={() => <Game sessionStore={SessionStore}  />} />
                                        </Switch>
                                </BrowserRouter>
                        </div>
                )
        }
}

export default withCookies(App)