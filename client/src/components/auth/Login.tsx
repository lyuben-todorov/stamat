import * as React from 'react'
import { RootState } from '../../redux/rootReducer'
import { loginUser, logoutUser } from '../../redux/sessionStore/sessionActions'
import { connect } from 'react-redux'
import { Grid, Header, Form, Segment, Message, Button } from 'semantic-ui-react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import Axios from 'axios'
import processVariables from '../../procVars'

const { endpoint, serverUrl, mode } = processVariables

interface Props extends RouteComponentProps {
    loginUser: typeof loginUser;
}
interface State {
    authenticationError: boolean;
    email: String;
    password: String;
}

const mapState = (state: RootState) => ({
    sessionStae: state.session
})
const mapDispatch = {
    loginUser: loginUser,
}
class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            authenticationError: false,
            email: "",
            password: ""
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
    handleSubmit = () => {
        event.preventDefault()
        Axios.post(`${serverUrl}${endpoint}/auth/login`, {
            email: this.state.email,
            password: this.state.password
        }, { withCredentials: true }).then((res) => {
            // set session token
            this.props.loginUser(res.data);
            localStorage.setItem('sessionId', res.data.sessionId);
            this.props.history.push('/game')
            window.location.reload();
        }).catch(err => {
            this.setState({ authenticationError: true })
        })
    }
    render() {
        return (

            <div>
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' textAlign='center' content='Log-in to your account' />
                        <Form error={this.state.authenticationError} onSubmit={this.handleSubmit} size='large'>
                            <Segment stacked>
                                <Form.Input
                                    name="email"
                                    onChange={this.handleInputChange}
                                    fluid icon='mail'
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
                                <Button
                                    type="submit"
                                    color="blue"
                                    fluid size="large"
                                    content="Login"
                                />
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <Link to={"/register"}>Sign Up</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div >
        )
    }
}

export default connect(mapState, mapDispatch)(withRouter(Login))