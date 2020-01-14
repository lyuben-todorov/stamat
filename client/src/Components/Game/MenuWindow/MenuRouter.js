import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chat from './Chat';
import Matchmaking from './Matchmaking';

export class MenuRouter extends Component {
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

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MenuRouter)
