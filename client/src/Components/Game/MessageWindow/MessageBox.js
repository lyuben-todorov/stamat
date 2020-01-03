import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import Message from './Message';

import { startMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';


@observer
class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }
    componentDidMount() {
        if (this.props.state === "guest") {
            this.setState(state => {
                const messages = [...state.messages, { type: "askUsername", message: "" }]

                return { messages }
            })
        }
    }
    onMessageAction = (message) => {
        console.log(message.type)
        switch (message.type) {
            case "startMatchmake":
                this.startMatchmaking();
            break;
            case "username":
                this.setState({username:message.payload})
                this.setState(state => {
                    const messages = [...state.messages, { type: "startMatchmake", message: "" }]
    
                    return { messages }
                })
            break;

            default:
                break;
        }
    }
    startMatchmaking(){
        var {username} =this.state;
        var matchup = {
            username:username
        }
        console.log('boing')
        this.props.startMatchmaking(matchup);

    }
    render() {
        return (
            <Segment className="MessageBox">
                {this.state.messages.map((message, index) => (
                    <Message onMessageAction={this.onMessageAction} type={message.type} key={index} message={message.message}></Message>
                ))}
            </Segment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.gameState
    }
}

const mapDispatchToProps = { startMatchmaking }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageBox)