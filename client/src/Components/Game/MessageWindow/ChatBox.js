import React, { Component } from 'react'
import { Segment, Input } from 'semantic-ui-react'


export default class ChatBox extends Component {
    constructor(props){
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleKeyDown(){

    }
    render() {
        
        return (
            <Segment className="ChatBox">
                <Input className="input" type="text" onKeyDown={this.handleKeyDown}></Input>
            </Segment>
        )
    }
}
