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
            messages: [],
            startedMatchmaking: false,
            username:"none"
        }
        this.addMatchmakingButton = this.addMatchmakingButton.bind(this);
    }
    componentDidMount() {
        if (this.props.state === "guest") {
            this.setState(state => {
                const messages = [...state.messages, { type: "askUsername", message: "" }]

                return { messages }
            })
        }
    }
    addMatchmakingButton() {
        if (!this.state.startedMatchmaking) {

            this.setState(state => {
                const messages = [...state.messages, { type: "startMatchmaking", message: "" }]

                return { messages }
            })
            this.setState({startedMatchmaking:true})
        }
    }
    onMessageAction = (message) => {
        console.log(message.type)
        switch (message.type) {
            case "startMatchmaking":
                this.startMatchmaking();
                break;
            case "postUsername":
                this.setState({ username: message.payload })
                this.addMatchmakingButton();
                break;

            default:
                break;
        }
    }
    startMatchmaking() {
        var { username } = this.state;
        var matchup = {
            username: username,
            socketId: this.props.socketId
        }
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
        state: state.gameState,
        socketId: state.socketId
    }
}

const mapDispatchToProps = { startMatchmaking }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageBox)