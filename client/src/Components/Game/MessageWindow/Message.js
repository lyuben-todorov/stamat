import React, { Component } from 'react'
import { Button, Grid, Input } from 'semantic-ui-react'
import { SOCKET_START_MATCHMAKING, CLIENT_REGISTER, CLIENT_PROPOSE_MATCHUP, SOCKET_REPLY_MATCHUP } from '../../../redux/gameState';


export default class Message extends Component {
    constructor(props) {
        super(props)
        const time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        this.state = {
            time: time.toString()
        }
    }
    render() {
        var messageBody;
        switch (this.props.type) {
            case SOCKET_START_MATCHMAKING:
                messageBody = <Button onClick={() => this.props.onMessageAction({ type: SOCKET_START_MATCHMAKING })}>Start</Button>
                break;
            case CLIENT_REGISTER:
                messageBody =
                    <Grid>
                        <Grid.Column width={10}>
                            <Input type="text"></Input>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Button onClick={() => this.props.onMessageAction({ type: CLIENT_REGISTER, payload: "gosho" })}>Submit</Button>
                        </Grid.Column>
                    </Grid>
                break;
            case CLIENT_PROPOSE_MATCHUP:
                messageBody =
                    <Grid columns={2}>
                        {this.props.message}
                        <Grid.Column>
                            <Button positive onClick={() =>
                                this.props.onMessageAction({ type: SOCKET_REPLY_MATCHUP, payload: { reply: false, opponentId: this.props.message } })}>Refuse</Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button positive onClick={() =>
                                this.props.onMessageAction({ type: SOCKET_REPLY_MATCHUP, payload: { reply: true, opponentId: this.props.message } })}>Accept</Button>
                        </Grid.Column>
                    </Grid>
                break;
            case "message":
                messageBody = <div>{this.props.message}</div>
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
