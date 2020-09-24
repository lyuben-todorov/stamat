import * as React from 'react'
import { Message as SemanticMessage } from 'semantic-ui-react'
import { CLIENT_PROPOSE_MATCHUP, CLIENT_GAME_OVER } from '../../../../../redux/matchStore/matchTypes';
import ChatMessage from '../../../../../redux/matchStore/models/ChatMessage';

interface State {
    time: string;
    className: string;
}
interface Props {
    message: ChatMessage
}
export default class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });

        let className;

        console.log(this.props.message)
        if (this.props.message.type !== "chat") {
            className = "Server";
        }

        this.state = {
            time: time.toString(),
            className: className,
        }
    }

    render() {
        var messageBody =
            <React.Fragment>
                <div className="Sender">{this.props.message.sender}</div>
                <div className="MessageText">
                    {this.props.message.message}
                </div>
            </React.Fragment>

        return (
            <SemanticMessage className={"Message " + this.state.className}>

                <div className="MessageBody flexbox">
                    {messageBody}
                </div>
                <div className="MessageTime">
                    {this.state.time}
                </div>


            </SemanticMessage>
        )
    }

}
