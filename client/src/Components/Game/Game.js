import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Grid } from 'semantic-ui-react';
import MoveWindow from './MoveWindow';
import ChessGame from './Chess/ChessGame';
import SessionStore from '../../Mobx/SessionStore';
import MenuWindow from './MenuWindow';
import '../_sass/Game.scss'
@observer
class Game extends Component {


        render() {
                return (
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
                )
        }
}

export default Game;
