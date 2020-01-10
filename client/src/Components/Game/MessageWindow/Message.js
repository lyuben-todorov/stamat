import React, { Component } from 'react'
import { Button, Grid, Input } from 'semantic-ui-react'
import { SERVER_START_MATCHMAKING, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, SERVER_REPLY_MATCHUP } from '../../../actions';


export default class Message extends Component {
    constructor(props) {
        super(props)
        const time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        this.state = {
            time: time.toString(),
        }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    render() {
        var messageBody;
        switch (this.props.type) {
            case SERVER_START_MATCHMAKING:
                messageBody = <Button onClick={() => this.props.onMessageAction({ type: SERVER_START_MATCHMAKING })}>Start</Button>
                break;
            case CLIENT_REGISTER_USER:
                messageBody =
                    <Grid>
                        <Grid.Column width={10}>
                            <Input name="username" onChange={this.handleInputChange} type="text"></Input>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Button onClick={() => this.props.onMessageAction({ type: CLIENT_REGISTER_USER, payload: this.state.username })}>Submit</Button>
                        </Grid.Column>
                    </Grid>
                break;
            case CLIENT_PROPOSE_MATCHUP:
                messageBody =
                    <Grid>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                {"Accept match against: " + this.props.message + "?"}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Button positive onClick={() =>
                                    this.props.onMessageAction({ type: SERVER_REPLY_MATCHUP, payload: { reply: true, opponentId: this.props.message } })}>Accept</Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button positive onClick={() =>
                                    this.props.onMessageAction({ type: SERVER_REPLY_MATCHUP, payload: { reply: false, opponentId: this.props.message } })}>Refuse</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                break;
            case "message":
                messageBody = <div>{this.props.message}</div>
                break;
            case "history":
                messageBody = <div>{this.props.message.from + this.props.message.to}</div>
                break;

            default:
                break;
        }

        return (
            <Grid className="message" divided="vertically">
                <Grid.Column width={14}>
                    {messageBody}
                </Grid.Column>
                <Grid.Column floated="right" width={2}>
                    {this.state.time}
                </Grid.Column>
            </Grid>
        )
    }

}
