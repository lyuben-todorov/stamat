import React, { Component } from 'react'
import axios from 'axios';
import { Grid, Form, Header, Segment, Message, Button } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import {serverUrl} from '../../processVariables'


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            status: "ok",
            passwordError: false,
            usernameError: false,
            emailError: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            passwordError: false,
            [name]: value
        });
    }


    handleSubmit(event) {
        event.preventDefault()
        if (this.state.password !== this.state.confirmPassword) {
            console.log("asd")
            this.setState({ passwordError: true });
            return;
        }
        axios.post(`${serverUrl}/auth/register`, {
            email: this.state.email,
            password: this.state.password,
            username: this.state.username
        }).then((res) => {
            //redirect user to login after successful register
            this.props.history.push('/login')

        }).catch(err => {
            console.log(err);
            if (err.response) {

                let { emailError, usernameError } = err.response.data;
                this.setState({ emailError: emailError, usernameError: usernameError })
            }
        })
    }

    render() {
        return (
            <div>

                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Sign up for chess!
                                </Header>
                        <Form error={this.state.passwordError || this.state.usernameError || this.state.emailError2} onSubmit={this.handleSubmit} size='large'>
                            <Segment stacked>
                                <Form.Input
                                    name="email"
                                    onChange={this.handleInputChange}
                                    fluid icon='mail'
                                    iconPosition='left'
                                    placeholder='E-mail' />
                                <Form.Input
                                    name="username"
                                    onChange={this.handleInputChange}
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='Username' />
                                <Form.Input
                                    name="password"
                                    onChange={this.handleInputChange}
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password' />
                                <Form.Input
                                    name="confirmPassword"
                                    onChange={this.handleInputChange}
                                    icon='lock' fluid
                                    iconPosition='left'
                                    placeholder='Confirm password'
                                    type='password' />
                                <Message
                                    error
                                    hidden={!this.state.passwordError}
                                    header="Passwords don't match" />
                                <Message
                                    error
                                    hidden={!this.state.usernameError}
                                    header="Username taken" />
                                <Message
                                    error
                                    hidden={!this.state.emailError}
                                    header="Email already registered." />

                                <Button type="submit" color='teal' fluid size='large'>
                                    Register</Button>
                            </Segment>
                        </Form>
                        <Message>
                            Already have an account? <Link to={"/login"} >Log in</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default withRouter(Register)