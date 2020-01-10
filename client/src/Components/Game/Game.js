import React, { Component } from 'react'
import { observer } from 'mobx-react'
import MessageWindow from './MessageWindow';
import MoveWindow from './MoveWindow';
import { Grid } from 'semantic-ui-react';
import { connect, Provider } from 'react-redux';
import ChessGame from './Chess/ChessGame';
import '../_sass/Game.scss'

import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import reducer from '../../redux/gameState'



let socket = io('http://localhost:3001');



let socketMiddleware = createSocketIoMiddleware(socket, ["server/", "game/"]);

@observer
class Game extends Component {

        constructor(props) {
                super()


        }
        componentWillMount() {
                console.log(sessionStore)
                let sessionStore = this.props.sessionStore;
                if (sessionStore) {
                        let gameStore = applyMiddleware(socketMiddleware)(createStore)(reducer);
                        this.setState({ gameStore: gameStore })
                }
        }
        render() {
                return (
                        <Provider context={this.state.gameStore}>
                                <Grid stackable divided="vertically">
                                        <Grid.Row columns={3}>
                                                <Grid.Column className="flexbox" width={4}>
                                                        <MessageWindow />
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                        <ChessGame className="MainChessboard" />
                                                </Grid.Column>
                                                <Grid.Column className="flexbox" width={4}>
                                                        <MoveWindow />
                                                </Grid.Column>
                                        </Grid.Row>
                                </Grid>
                        </Provider>
                )
        }
}

export default Game;