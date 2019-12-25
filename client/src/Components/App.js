import React, { Component } from 'react'
import '../Sass/App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './Auth/Home';
import axios from 'axios';
import Dashboard from './Auth/Dashboard';

const root = "http://localhost:3001/user";

export default class App extends Component {
        constructor(props) {
                super();
                this.state = { secret: "i dont know" };
                this.handleButton = this.handleButton.bind(this);
        }
        handleButton(event) {
                event.preventDefault();
                axios.get(root + "/kur", {withCredentials:true}).then((value) => {
                        this.setState({secret:value})
                }).catch((err)=>{
                        console.log("kur")
                })
        }
        render() {
                return (
                        <div className="App">

                                <Router>
                                        <header className="App-header">
                                                <ul>
                                                        <li>
                                                                <Link to="/">Home</Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/login">Login</Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/register">Register</Link>
                                                        </li>
                                                </ul>
                                        </header>

                                        <hr />
                                        <p>{this.state.secret}</p>
                                        {
                                                <Switch>
                                                        <Route exact path="/">
                                                                <Dashboard />
                                                        </Route>
                                                        <Route path="/login">
                                                                <Login />
                                                        </Route>
                                                        <Route path="/register">
                                                                <Register />
                                                        </Route>
                                                </Switch>
                                        }
                                </Router>
                        </div>
                )
        }
}

