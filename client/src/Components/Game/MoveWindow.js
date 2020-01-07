import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import Message from './MessageWindow/Message'

export default class MoveWindow extends Component {
    constructor(props){
        super(props)

        this.state = { messages:[] }
    }
    render() {
        return (

                <Segment className="MessageWindow">
                    {this.state.messages.map((message, index) => (
                        <Message onMessageAction={this.onMessageAction} type={message.type} key={index} message={message.message}></Message>
                    ))}
                </Segment>
        )
    }
}
