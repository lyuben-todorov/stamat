import React, { Component } from 'react'
import { observer } from 'mobx-react'
import io from 'socket.io-client';
import withAuth from '../ProxyComponents/withAuth'
@observer
class Game extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        response: 0,
                        server: "localhost:3001"
                };
        }

        componentDidMount(){
                const socket = io(this.state.server);
                socket.on('connect', ()=>{
                        
                })
        }
        render() {
                return (
                        <div>

                        </div>
                )
        }
}
export default withAuth(Game);
