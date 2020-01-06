import React, { Component } from 'react'
import { Button, Grid, Input } from 'semantic-ui-react'

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
            case "startMatchmaking":
                messageBody = <Button onClick={() => this.props.onMessageAction({ type: "startMatchmaking" })}>Start</Button>
                break;
            case "askUsername":
                messageBody =
                    <Grid>
                        <Grid.Column width={10}>
                            <Input type="text"></Input>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Button onClick={() => this.props.onMessageAction({ type: "postUsername", payload: "gosho" })}>Submit</Button>
                        </Grid.Column>
                    </Grid>
                break;
            default:
                messageBody = this.props.message
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
