import React, { Component } from 'react'
import '../../Sass/App.css';
import Login from './Login';
import Register from '../Register';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './Home';
import axios from 'axios';

const root = "http://localhost:3001";

export default class App extends Component {
        constructor(props) {
                super();
                this.state = { secret: "i dont know" };
                this.handleButton = this.handleButton.bind(this);
        }
        handleButton(event) {
                axios.get(root + "/kur").then((value) => {
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
                                                <button onClick={this.handleButton}> AAAAAAAAAAA</button>
                                        </header>

                                        <hr />
                                        <p>{this.state.secret}</p>
                                        {
                                                <Switch>
                                                        <Route exact path="/">
                                                                <Home />
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

