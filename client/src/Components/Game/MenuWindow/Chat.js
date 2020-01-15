import React, { Component } from 'react'
import { Input, Divider } from 'semantic-ui-react'
import MessageBox from './MessageBox';
import { connect } from 'react-redux'
import { sendChatMessage } from '../../../redux/actionCreators'


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
    }
    handleKeyDown(e) {
        if (e.key === "Enter" && this.state.message !== "") {
            this.props.sendChatMessage({message:this.state.message, channel:"opponent"});
            this.setState({ message: "" })
        }
    }
    updateMessage(event) {
        this.setState({ message: event.target.value })

    }
    render() {

        return (
            <div className="ChatBox">
                <MessageBox />
                <Divider />
                <Input className="input" type="text" value={this.state.message} tabIndex={0} onChange={this.updateMessage} onKeyDown={this.handleKeyDown}></Input>
            </div>
        )
    }
}





const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    sendChatMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
