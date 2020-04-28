import * as React from 'react'
import { Input, Divider, InputOnChangeData } from 'semantic-ui-react'
import MessageBox from './MessageBox/MessageBox';
import { connect } from 'react-redux'
import { RootState } from '../../../../redux/rootReducer';
import { sendChatMessage } from '../../../../redux/matchStore/matchActions';
import ChatMessage from '../../../../redux/matchStore/models/ChatMessage';

interface Props {

    sendChatMessage: typeof sendChatMessage;
    proponentName: string
}

interface State {
    currentMessage: string;

}
class Chat extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentMessage: ""
        }
    }
    handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && this.state.currentMessage !== "") {
            var message: ChatMessage = {
                channel: "currentMatch",
                message: this.state.currentMessage,
                sender: this.props.proponentName,
                type: "chat"
            }
            this.props.sendChatMessage(message);
            this.setState({ currentMessage: "" })
        }
    }
    handleChange = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        this.setState({ currentMessage: event.target.value })

    }
    render() {

        return (
            <div className="ChatBox">
                <MessageBox />
                <Divider />
                <Input className="input" type="text"
                    value={this.state.currentMessage}
                    tabIndex={0}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
            </div>
        )
    }
}





const mapStateToProps = (state: RootState) => ({
    proponentName: state.session.username
})

const mapDispatchToProps = {
    sendChatMessage: sendChatMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
