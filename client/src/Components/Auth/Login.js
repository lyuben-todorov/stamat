import React, { Component } from 'react'
import axios from 'axios';
import { Grid, Header, Form, Segment, Button, Message } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const root = "http://localhost:3001/auth";

@observer
class Login extends Component {
        constructor(props) {
                super(props);
                this.state = { email: '', password: '', authenticationError: false };

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
                axios.post(root + "/login", {
                        email: this.state.email,
                        password: this.state.password
                }, { withCredentials: true }).then((res) => {
                        this.props.history.push('/profile')
                }).catch(err => {
                        console.log(err)
                        this.setState({ authenticationError: true })
                })
        }

        render() {

                return (
                        <div>
                                <Grid textAlign='center' verticalAlign='middle'>
                                        <Grid.Column style={{ maxWidth: 450 }}>
                                                <Header as='h2' color='teal' textAlign='center'>
                                                        Log-in to your account
                                                        </Header>
                                                <Form error={this.state.authenticationError} onSubmit={this.handleSubmit} size='large'>
                                                        <Segment stacked>
                                                                <Form.Input
                                                                        name="email"
                                                                        onChange={this.handleInputChange}
                                                                        fluid icon='user'
                                                                        iconPosition='left'
                                                                        placeholder='E-mail' />
                                                                <Form.Input
                                                                        name="password"
                                                                        onChange={this.handleInputChange}
                                                                        fluid
                                                                        icon='lock'
                                                                        iconPosition='left'
                                                                        placeholder='Password'
                                                                        type='password' />

                                                                <Message
                                                                        error
                                                                        header='Wrong email/password' />
                                                                <Button type="submit" color='teal' fluid size='large'>
                                                                        Login</Button>
                                                        </Segment>
                                                </Form>
                                                <Message>
                                                        New to us? <a href='/register'>Sign Up</a>
                                                </Message>
                                        </Grid.Column>
                                </Grid>
                        </div>
                );
        }
}
const mapStateToProps = (state) => {
        return {
                userType: state.userType,
                gameState: state.gameState,
                socketId: state.socketId,
                oponent: state.oponent
        }
}

const mapDispatchToProps = { }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(withRouter(Login))