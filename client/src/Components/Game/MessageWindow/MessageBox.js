import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react';
import Message from './Message';

import { startMatchmaking, replyMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';
import { SERVER_START_MATCHMAKING, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, SERVER_REPLY_MATCHUP } from '../../../actions';


@observer
class MessageBox extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        messages: [],
                        startedMatchmaking: false,
                        startedGame: false,
                }


                this.addMatchmakingButton = this.addMatchmakingButton.bind(this);
                this.addMatchupProposalButton = this.addMatchupProposalButton.bind(this);
                this.addStartGameMessage = this.addStartGameMessage.bind(this);
                this.addTextMessage = this.addTextMessage.bind(this);
        }
        componentDidMount(){
                if (this.props.userType === "guest") {
                        this.setState(state => {
                                const messages = [...state.messages, { type: CLIENT_REGISTER_USER, message: "" }]

                                return { messages }
                        })
                
                }else{
                        this.addMatchmakingButton();
                }
        }

        componentDidUpdate(prevProps) {
                if (this.props.gameState !== prevProps.gameState) {
                        if (this.props.gameState === "proposal") {
                                this.addMatchupProposalButton();
                        }
                        if (this.props.gameState === "ongoing" && !this.state.startedGame) {
                                this.addStartGameMessage();
                                this.setState({ startedGame: true });
                        }

                }
        }
        addMatchupProposalButton() {
                this.setState(state => {
                        const messages = [...state.messages, { type: CLIENT_PROPOSE_MATCHUP, message: this.props.opponentId }]

                        return { messages }
                })
        }
        addMatchmakingButton() {
                if (!this.state.startedMatchmaking) {

                        this.setState(state => {
                                const messages = [...state.messages, { type: SERVER_START_MATCHMAKING, message: "" }]

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
        addStartGameMessage() {
                this.addTextMessage("Started Game!");
        }
        onMessageAction = (message) => {
                switch (message.type) {
                        case SERVER_START_MATCHMAKING:
                                this.startMatchmaking();
                                break;
                        case CLIENT_REGISTER_USER:
                                this.setState({ username: message.payload })
                                this.addMatchmakingButton();
                                break;
                        case SERVER_REPLY_MATCHUP:
                                this.props.replyMatchmaking(message.payload);
                                break;
                        default:
                                console.log(message);
                                break;
                }
        }
        startMatchmaking() {
                var matchup = {
                        username: this.props.sessionStore.username,
                        sessionId: this.props.sessionStore.sessionId
                }
                console.log(matchup);
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
                userType: state.userType,
                gameState: state.gameState,
                sessionId: state.sessionId,
                opponentId: state.opponentId
        }
}

const mapDispatchToProps = { startMatchmaking, replyMatchmaking }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)