import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import { serverUrl } from '../processVariables'
import { observer } from 'mobx-react';
import SessionStore from '../Mobx/SessionStore';
import Game from './Game/Game';
import { Redirect } from 'react-router';

@observer
export class Stamat extends Component {
    constructor(props) {
        super(props)


        let sessionId = this.props.sessionStore.sessionId;
        if (sessionId === null || sessionId === undefined) {
            this.props.sessionStore.setSessionId(sessionId);
            this.state = { session: false }
            return;
        }

        this.state = { session: true }

        axios.get(`${serverUrl}/auth/restore`, { withCredentials: true }).then((res) => {

            this.props.sessionStore.loginUser(res.data)
        })

    }
    render() {
        return (
            <div>
                {this.state.session ?
                    <Game sessionStore={SessionStore}> </Game>
                    :
                    <Redirect to={"/login"}></Redirect>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Stamat)
