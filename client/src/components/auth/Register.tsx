import * as React from 'react'
import { Grid, Header, Form, Segment, Message, Button } from 'semantic-ui-react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import Axios, { AxiosResponse } from 'axios'
import processVariables from '../../procVars'

const { endpoint, serverUrl, mode } = processVariables

interface Props extends RouteComponentProps {

}
interface State {
    passwordError: boolean;
    usernameError: boolean;
    emailError: boolean;
    password: String;
    confirmPassword: String;
    email: String;
    username: String;
}
class Register extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            passwordError: false,
            usernameError: false,
            emailError: false,
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        }
    }
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name as keyof State;

        this.setState({
            ...this.state,
            [name]: value
        });
    }
    handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ passwordError: true });
            return;
        }
        Axios.post(`${serverUrl}${endpoint}/auth/register`, {
            email: this.state.email,
            password: this.state.password,
            username: this.state.username
        }).then((res: AxiosResponse) => {
            //redirect user to login after successful register
            this.props.history.push('/login')
        }).catch(err => {
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
                        <Header as='h2' color='blue' textAlign='center' content='Sign up for chess!' />
                        <Form error={this.state.passwordError || this.state.usernameError || this.state.emailError} onSubmit={this.handleSubmit} size='large'>
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

                                <Button type="submit" color='blue' fluid size='large'>
                                    Register</Button>
                            </Segment>
                        </Form>
                        <Message>
                            Already have an account? <Link to={"/login"} >Log in</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Register)