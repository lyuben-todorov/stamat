import React, { Component } from 'react'
import { Segment, Divider } from 'semantic-ui-react'
import '../../_sass/MessageWindow.scss'
import MessageBox from './MessageBox'
import ChatBox from './ChatBox'
import { observer } from 'mobx-react'

@observer
export default class MessageWindow extends Component {
    render() {
        return (
            <Segment className="MessageWindow">
                <MessageBox>
                </MessageBox>
                <Divider/>
                <ChatBox>
                </ChatBox>
            </Segment>
        )
    }
}
