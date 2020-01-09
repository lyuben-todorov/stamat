import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import Message from './MessageWindow/Message'
import { connect } from 'react-redux'

class MoveWindow extends Component {
    render() {
        return (

            <Segment className="MessageWindow">
                <Segment className="MessageBox">
                    {this.props.history.map((message, index) => (
                        <Message onMessageAction={this.onMessageAction} type={"history"} key={index} message={message}></Message>
                    ))}
                </Segment>
            </Segment>
        )
    }

}
const mapStateToProps = (state /*, ownProps*/) => {
    return {
        history: state.history
    }
}
const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MoveWindow)

