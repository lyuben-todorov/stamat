import * as React from 'react'
import Message from './Message';
import { connect } from 'react-redux';
import { CLIENT_PROPOSE_MATCHUP, CLIENT_GAME_OVER, CLIENT_SEND_CHAT_MESSAGE } from '../../../../../redux/matchStore/matchTypes';
import { RootState } from '../../../../../redux/rootReducer';
import ChatMessage from '../../../../../redux/matchStore/models/ChatMessage';
import { acknowledge, ClientState, gameState } from '../../../../../redux/clientStateStore/clientStateReducer';

interface Props {

        action: gameState;
        chatHistory: ChatMessage[];
        winner: string;
        username: string;

        acknowledge: typeof acknowledge;
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
                var mount: ChatMessage = {
                        channel: "currentMatch",
                        message: " Please be kind and respectful to other players.",
                        sender: "MOTD:",
                        type: "ping"
                }
                this.addMessage(mount);
        }
        addMessage(message: ChatMessage) {


                this.setState(state => {
                        const messages = [...state.messages, message]
                        return { messages }
                })
        }

        componentDidUpdate(prevProps: Props) {
                if (this.props.action !== prevProps.action || this.props.chatHistory !== prevProps.chatHistory) {
                        switch (this.props.action) {
                                case "starting":
                                        //this.addMessage(CLIENT_START_GAME)
                                        break;
                                case "game_over":

                                        if (this.props.winner === "draw") {
                                                var message: ChatMessage = {
                                                        channel: "currentMatch",
                                                        message: "Draw",
                                                        sender: "",
                                                        type: "gameOver"
                                                }
                                                this.addMessage(message)

                                        } else {
                                                var message: ChatMessage = {
                                                        channel: "currentMatch",
                                                        message: "Game Over",
                                                        sender: "",
                                                        type: "gameOver"
                                                }
                                                this.addMessage(message);
                                        }

                                case "receive_chat_message":
                                        var message = this.props.chatHistory.slice(-1)[0]

                                        console.log(message);
                                        this.addMessage(message);

                                        this.props.acknowledge();
                                default:
                                        break;
                        }

                }
        }


        render() {
                return (
                        <div className="ChatHistory">
                                {this.state.messages.map((message: ChatMessage, index: number) => (
                                        <Message message={message} key={index} ></Message>
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

const mapDispatchToProps = {
        acknowledge: acknowledge
}

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(MessageBox)
