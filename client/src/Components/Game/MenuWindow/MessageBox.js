import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import Message from './Message';

import { startMatchmaking, replyMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';
import { SERVER_START_MATCHMAKING, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, SERVER_REPLY_MATCHUP, CLIENT_GAME_OVER, CLIENT_RESUME_SESSION, CLIENT_START_GAME, CLIENT_SEND_CHAT_MESSAGE } from '../../../actions';
import { reaction } from 'mobx';


@observer
class MessageBox extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        messages: [],
                }
                this.addTextMessage = this.addTextMessage.bind(this);
                this.addMessage = this.addMessage.bind(this);
        }

        componentDidMount() {
                this.addMessage("greet","hi");
        }
        addMessage(type, message,level="server") {

                this.setState(state => {
                        const messages = [...state.messages,  {
                                type: type,
                                message: message,
                                level:level
                        }]
                        return { messages }
                })
        }

        componentDidUpdate(prevProps) {
                if (this.props.action !== prevProps.action || this.props.chatHistory !== prevProps.chatHistory) {
                        console.log(this.props)
                        switch (this.props.action) {
                                case "initiateGame" || "resumeGame":
                                        //this.addMessage(CLIENT_START_GAME)
                                        break;
                                case "gameOver":
                                        this.addMessage(CLIENT_GAME_OVER,
                                                this.props.winner === this.props.sessionId ? this.props.username : this.props.opponentName)
                                        break;
                                case "serverMessage":
                                        this.addMessage("server", this.props.latestMessage, "player")
                                        break;
                                case "ownMessage":
                                        this.addMessage("client", this.props.latestMessage, "player")
                                        break
                                default:
                                        break;
                        }

                }
        }

        addMatchupProposalButton() {
                this.setState(state => {
                        const messages = [...state.messages, { type: CLIENT_PROPOSE_MATCHUP, message: this.props.opponentName }]

                        return { messages }
                })
        }
        addTextMessage(message) {
                this.setState(state => {
                        const messages = [...state.messages, { type: CLIENT_SEND_CHAT_MESSAGE, message: message }]
                        return { messages }
                })
        }

        render() {
                return (
                        <div className="ChatHistory">
                                {this.state.messages.map((message, index) => (
                                        <Message type={message.type} level={message.level} key={index} message={message.message}></Message>
                                ))}

                        </div>

                )
        }
}

const mapStateToProps = (state) => {
        return {
                userType: state.userType,
                gameState: state.gameState,
                sessionId: state.sessionId,
                opponentName: state.opponentName,
                winner: state.winner,
                username: state.username,
                action: state.action,
                latestMessage: state.latestMessage,
                chatHistory:state.chatHistory
        }
}

const mapDispatchToProps = { startMatchmaking, replyMatchmaking }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)