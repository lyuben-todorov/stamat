import * as React from 'react'
import { RootState } from '../../redux/rootReducer'
import { loginUser, logoutUser } from '../../redux/sessionStore/sessionActions'
import { connect } from 'react-redux'
import { Grid, Header, Form, Segment, Message, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

interface Props {

}
interface State {
    authenticationError: boolean;
}

const mapState = (state: RootState) => ({
    sessionState: state.session
})

const mapDispatch = {
    loginUser: loginUser,
    logoutUser: logoutUser
}
class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            authenticationError: false
        }
    }

    handleSubmit = () => {

    }
    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    }
    render() {
        return (
            <div>
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' textAlign='center'>
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

export default connect(
    mapState,
    mapDispatch
)(Login)