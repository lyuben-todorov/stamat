import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Grid } from 'semantic-ui-react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import MoveWindow from './MoveWindow';
import ChessGame from './Chess/ChessGame';
import reducer from '../../redux/gameState'
import SessionStore from '../../Mobx/SessionStore';
import { serverUrl } from '../../processVariables';
import { mode } from '../../processVariables'
import MenuWindow from './MenuWindow';
import '../_sass/Game.scss'
@observer
class Game extends Component {

        constructor(props) {
                super(props)

                let connectionString = `${serverUrl}/?session=${this.props.sessionStore.sessionId}`;
                let socket
                if(mode==="development"){
                        socket = io(connectionString);
                }else{
                        socket = io(connectionString)
                }
                let socketMiddleware = createSocketIoMiddleware(socket, ["server/", "game/"]);
                let gameStore = applyMiddleware(socketMiddleware)(createStore)(reducer);
                this.state = { gameStore: gameStore };

        }
        render() {
                return (
                        <Provider store={this.state.gameStore}>
                                <Grid stackable divided="vertically">
                                        <Grid.Row columns={3}>
                                                <Grid.Column className="flexbox" width={4}>
                                                        <MenuWindow sessionStore={SessionStore} />
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                        <ChessGame sessionStore={SessionStore} className="MainChessboard" />
                                                </Grid.Column>
                                                <Grid.Column className="flexbox" width={4}>
                                                        <MoveWindow sessionStore={SessionStore} />
                                                </Grid.Column>
                                        </Grid.Row>
                                </Grid>
                        </Provider>
                )
        }
}

export default Game;
