import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import Message from './Message';

import { startMatchmaking, replyMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';
import { SOCKET_START_MATCHMAKING, CLIENT_REGISTER, CLIENT_PROPOSE_MATCHUP, SOCKET_REPLY_MATCHUP } from '../../../redux/gameState';


@observer
class MessageBox extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        messages: [],
                        startedMatchmaking: false,
                        username: "none"
                }
                this.addMatchmakingButton = this.addMatchmakingButton.bind(this);
                this.addMatchupProposalButton = this.addMatchupProposalButton.bind(this);
                this.startGame = this.startGame.bind(this);
                this.addTextMessage = this.addTextMessage.bind(this);
        }
        componentDidMount() {
                if (this.props.gameState === "guest") {
                        this.setState(state => {
                                const messages = [...state.messages, { type: CLIENT_REGISTER, message: "" }]

                                return { messages }
                        })
                }

        }
        componentDidUpdate(prevProps) {
                if (this.props.gameState !== prevProps.gameState) {
                        if (this.props.gameState === "proposal") {
                                this.addMatchupProposalButton();
                        }
                        if (this.props.gameState === "game") {
                                this.startGame();
                        }

                }
        }
        addMatchupProposalButton() {
                this.setState(state => {
                        const messages = [...state.messages, { type: CLIENT_PROPOSE_MATCHUP, message: this.props.socketId }]

                        return { messages }
                })
        }
        addMatchmakingButton() {
                if (!this.state.startedMatchmaking) {

                        this.setState(state => {
                                const messages = [...state.messages, { type: SOCKET_START_MATCHMAKING, message: "" }]

                                return { messages }
                        })
                        this.setState({ startedMatchmaking: true })
                }
        }
        addTextMessage(message) {
                this.setState(state => {
                        const messages = [...state.messages, { type: "message", message: message }]
                        return { messages }
                })
        }
        startGame() {
                this.addTextMessage("Started Game!");
        }
        onMessageAction = (message) => {
                switch (message.type) {
                        case SOCKET_START_MATCHMAKING:
                                this.startMatchmaking();
                                break;
                        case CLIENT_REGISTER:
                                this.setState({ username: message.payload })
                                this.addMatchmakingButton();
                                break;
                        case SOCKET_REPLY_MATCHUP:
                                console.log(message.payload);
                                this.props.replyMatchmaking(message.payload);
                                break;
                        default:
                                console.log(message);
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
                gameState: state.gameState,
                socketId: state.socketId,
                oponent: state.oponent
        }
}

const mapDispatchToProps = { startMatchmaking, replyMatchmaking }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)