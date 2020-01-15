import React, { Component } from 'react'
import { Button, Grid, Container } from 'semantic-ui-react'
import { Message as SemanticMessage } from 'semantic-ui-react'
import { SERVER_START_MATCHMAKING, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, SERVER_REPLY_MATCHUP, CLIENT_GAME_OVER, CLIENT_SEND_CHAT_MESSAGE } from '../../../actions';


export default class Message extends Component {
    constructor(props) {
        super(props)
        const time = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        let className
        if (this.props.level === "server") {
            className = "Message Server"
        } else if (this.props.level === "player") {
            className = "Message";
        }
        console.log(props);
        this.state = {
            time: time.toString(),
            className: className,
        }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    render() {
        var messageBody;

        switch (this.props.type) {
            case "greet":
                messageBody = "Please be nice!"
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
                messageBody =
                    <React.Fragment>
                        <div className="Sender">Opponent:</div>
                        {this.props.message}
                    </React.Fragment>
                break;
            case "client":
                messageBody = <React.Fragment>
                    <div className="Sender">You:</div>
                    {this.props.message}
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
