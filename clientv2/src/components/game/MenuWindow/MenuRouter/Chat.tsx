import * as React from 'react'
import { Input, Divider, InputOnChangeData } from 'semantic-ui-react'
import MessageBox from './MessageBox/MessageBox';
import { connect } from 'react-redux'
//import { sendChatMessage } from '../../../redux/actionCreators'
import { RootState } from '../../../../redux/rootReducer';

interface Props {

    sendChatMessage: Function;
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
            this.props.sendChatMessage({ message: this.state.currentMessage, channel: "opponent" });
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

})

const mapDispatchToProps = {
    sendChatMessage: () => { }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
