import * as React from 'react'
import Message from './Message';

// import { startMatchmaking, replyMatchmaking } from '../../../redux/actionCreators'
import { connect } from 'react-redux';
import { CLIENT_PROPOSE_MATCHUP, CLIENT_GAME_OVER, CLIENT_SEND_CHAT_MESSAGE } from '../../../../../redux/matchStore/matchTypes';
import { RootState } from '../../../../../redux/rootReducer';
import ChatMessage from '../../../../../redux/matchStore/models/ChatMessage';

interface Props {

        action: string;
        chatHistory: ChatMessage[];
        winner: string;
        username: string;
}
interface State {
        messages: ChatMessage[];
}
export type ChatMessageTypes = "gameOver" | "initiateGame" | "resumeGame" | "chat" | "ping";
export type ChatMessageChannels = "currentMatch" | "private" | "global";
class MessageBox extends React.Component<Props, State> {
        constructor(props: Props) {
                super(props);
                this.state = {
                        messages: [],
                }
                this.addMessage = this.addMessage.bind(this);
        }

        componentDidMount() {
                this.addMessage("ping", "currentMatch", "hi");
        }
        addMessage(type: ChatMessageTypes, channel?: ChatMessageChannels, message?: string) {

                this.setState(state => {
                        const messages = [...state.messages, {
                                type: type,
                                channel: channel,
                                message: message,
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
                                                this.addMessage("gameOver", "currentMatch", "Draw")

                                        } else {

                                                this.addMessage("gameOver", "currentMatch", "");
                                        }

                                case "receive_chat_message":
                                        this.addMessage("chat",
                                                this.props.chatHistory[this.props.chatHistory.length - 1].channel,
                                                this.props.chatHistory[this.props.chatHistory.length - 1].message)
                                default:
                                        break;
                        }

                }
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
                action: state.clientState.gameState,
                chatHistory: state.match.chatHistory,
                winner: "winner chicken dinner",
                username: state.session.username,
        }
}

const mapDispatchToProps = {}

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)
