import React, { Component } from 'react'
import { Segment, Divider } from 'semantic-ui-react'
import MessageBox from './MessageWindow/MessageBox'
import ChatBox from './MessageWindow/ChatBox'
import { observer } from 'mobx-react'
import SessionStore from '../../Mobx/SessionStore'

@observer
export default class MessageWindow extends Component {
    render() {
        return (
            <Segment className="MessageWindow">
                <MessageBox sessionStore={SessionStore}/>
                <Divider/>
                <ChatBox sessionStore={SessionStore}/>
            </Segment>
        )
    }
}
