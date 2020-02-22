import * as React from 'react'
import Message from './Message';

// import { startMatchmaking, replyMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';
import { CLIENT_PROPOSE_MATCHUP, CLIENT_GAME_OVER, CLIENT_SEND_CHAT_MESSAGE } from '../../../../../redux/matchStore/matchTypes';
import { RootState } from '../../../../../redux/rootReducer';

interface Props {

        action: string;
        chatHistory: any;
        winner: string;
        opponentName: string;
        latestMessage: any;
        sessionId: string;
        username: string;
}
interface State {
        messages: any;
}

class MessageBox extends React.Component<Props, State> {
        constructor(props: Props) {
                super(props);
                this.state = {
                        messages: [],
                }
                this.addTextMessage = this.addTextMessage.bind(this);
                this.addMessage = this.addMessage.bind(this);
        }

        componentDidMount() {
                this.addMessage("greet", "hi");
        }
        addMessage(type: string, message?: string, level = "server") {

                this.setState(state => {
                        const messages = [...state.messages, {
                                type: type,
                                message: message,
                                level: level
                        }]
                        return { messages }
                })
        }

        componentDidUpdate(prevProps: Props) {
                if (this.props.action !== prevProps.action || this.props.chatHistory !== prevProps.chatHistory) {
                        switch (this.props.action) {
                                case "initiateGame" || "resumeGame":
                                        //this.addMessage(CLIENT_START_GAME)
                                        break;
                                case "gameOver":

                                        if (this.props.winner === "draw") {
                                                this.addMessage("draw")

                                        } else {

                                                this.addMessage(CLIENT_GAME_OVER, this.props.winner === this.props.sessionId ? this.props.username : this.props.opponentName)
                                        }
                                        break;
                                case "serverMessage":
                                        this.addMessage("server", this.props.latestMessage.message, this.props.latestMessage.sender)
                                        break;
                                case "ownMessage":
                                        this.addMessage("client", this.props.latestMessage.message, "opponent")
                                        break;
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
        addTextMessage(message: string) {
                this.setState(state => {
                        const messages = [...state.messages, { type: CLIENT_SEND_CHAT_MESSAGE, message: message }]
                        return { messages }
                })
        }

        render() {
                return (
                        <div className="ChatHistory">
                                {this.state.messages.map((message: any, index: number) => (
                                        <Message type={message.type} level={message.level} key={index} message={message.message}></Message>
                                ))}

                        </div>

                )
        }
}

const mapStateToProps = (state: RootState) => {
        return {
                action: "string",
                chatHistory: "",
                winner: "",
                opponentName: "",
                latestMessage: "any",
                sessionId: "string",
                username: "string"
        }
}

const mapDispatchToProps = { startMatchmaking: () => { }, replyMatchmaking: () => { } }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)
