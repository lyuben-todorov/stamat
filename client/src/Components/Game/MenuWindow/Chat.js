import React, { Component } from 'react'
import { Input, Divider } from 'semantic-ui-react'


export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleKeyDown() {

    }
    render() {

        return (
            <div className="ChatBox">
                <div className ="ChatHistory">
                </div>
                <Divider />
                <Input className="input" type="text" onKeyDown={this.handleKeyDown}></Input>
            </div>
        )
    }
}
