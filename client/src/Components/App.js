import React, { Component } from 'react'
import './_sass/App.scss';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Home from './Auth/Home';
import axios from 'axios';
import sessionStore from '../Mobx/SessionStore';
import { Segment, Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Dashboard from './Auth/Dashboard';

const root = "http://localhost:3001/auth";

@observer
export default class App extends Component {
        constructor(props) {
                super(props);
                this.state = { secret: "i dont know" };
                this.handleLogout = this.handleLogout.bind(this);
        }

        handleLogout() {

                axios.get(root + "/logout").catch((err) => {
                        console.log(err);
                }).then(()=>{
                        this.props.store.logout();
                })
        }
        render() {
                const loggedIn = this.props.store.loggedIn;
                return (
                        <div className="App">
                                <BrowserRouter>
                                        <Segment>
                                                <Button floated="left" >
                                                        <Link to="/home"> Home</Link>
                                                </Button>


                                                {loggedIn ?
                                                        <div>
                                                                <Button floated="right">
                                                                        <Link to={"#"} onClick={this.handleLogout}>Logout</Link>
                                                                </Button>
                                                        </div>
                                                        :
                                                        <div>
                                                                <Button floated="right">
                                                                        <Link to="/login"> Login</Link>
                                                                </Button>

                                                                <Button floated="right" >
                                                                        <Link to="/register"> Register</Link>
                                                                </Button>
                                                        </div>
                                                }
                                                <Header size="huge">Ebre-debre</Header>

                                        </Segment>
                                        <Switch>
                                                <Route path="/login" render={() => <Login sessionStore={sessionStore} />} />
                                                <Route path="/register" render={() => <Register sessionStore={sessionStore} />} />
                                                <Route path="/*" component={Dashboard} />
                                        </Switch>
                                </BrowserRouter>
                        </div>
                )
        }
}

