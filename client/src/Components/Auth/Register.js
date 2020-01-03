import React, { Component } from 'react'
import axios from 'axios';

const root = "http://localhost:3001/user";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', status: "ok" };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleSubmit(event) {
        event.preventDefault()
        axios.post(root + "/register", {
            email: this.state.email,
            password: this.state.password
        }).catch(err => {
            console.log(err);
            this.setState({ status: "not ok" })
        })
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.status}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label> Email:
                                <input name="email" type="text" value={this.state.value} onChange={this.handleInputChange} />
                    </label>
                    <label> Password:
                                <input name="password" type="password" value={this.state.value} onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}