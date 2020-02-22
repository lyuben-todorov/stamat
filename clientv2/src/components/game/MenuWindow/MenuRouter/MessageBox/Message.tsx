import * as React from 'react'
import { Message as SemanticMessage } from 'semantic-ui-react'
import { CLIENT_PROPOSE_MATCHUP, CLIENT_GAME_OVER } from '../../../../../redux/matchStore/matchTypes';

interface State {
    time: string;
    className: string;
}
interface Props {
    level: string;
    type: string;
    message: string;
}
export default class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        let className
        if (this.props.level === "server") {
            className = "Message Server"

            className = "Message";
        }
        this.state = {
            time: time.toString(),
            className: className,
        }
    }

    render() {
        var messageBody;

        switch (this.props.type) {
            case "greet":
                messageBody = " be nice"
                break;
            case CLIENT_PROPOSE_MATCHUP:
                break;
            case CLIENT_GAME_OVER:
                messageBody =
                    <div>
                        {this.props.message + " has won!"}
                    </div>

                break;
            case "server":
                if (this.props.level === "server") {

                    messageBody =
                        <React.Fragment>
                            <div className="Server"></div>
                            {this.props.message}
                        </React.Fragment>
                } else {
                    messageBody =
                        <React.Fragment>
                            <div className="Sender">Opponent:</div>
                            {this.props.message}
                        </React.Fragment>
                }
                break;

            case "client":
                messageBody =
                    <React.Fragment>
                        <div className="Sender">You:</div>
                        {this.props.message}
                    </React.Fragment>
                break;
            case "draw":
                messageBody =
                    <React.Fragment>
                        <div className="Server"></div>
                        Players have agreed to a draw!
                        </React.Fragment>
                break;
            default:
                break;
        }

        return (
            <SemanticMessage className={this.state.className}>

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
