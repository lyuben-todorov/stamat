import React, { Component } from 'react'
import Chat from './Chat';
import Matchmaking from './Matchmaking';

export class MenuRouter extends Component {
    
    component
    render() {
        return (
            <div className="MenuRouter">
                {(() => {
                    switch (this.props.active) {
                        case 'matchmaking':
                            return <Matchmaking />
                        case 'chat':
                            return <Chat />
                        case 'history':
                            return "no"
                        default:
                            break;
                    }
                })()}
            </div>
        )
    }
}
