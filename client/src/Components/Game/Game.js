import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Chessboard from 'chessboardjsx';
import MessageWindow from './MessageWindow';
import MoveWindow from './MoveWindow';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { startMatchmaking } from '../../redux/actionCreators'

@observer
class Game extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        mode: "default",
                };
        }

        componentDidMount() {
        }
        render() {
                return (
                        <Grid divided="vertically">
                                <Grid.Row columns={3}>
                                        <Grid.Column>
                                                <MessageWindow></MessageWindow>
                                        </Grid.Column>
                                        <Grid.Column>
                                                <Chessboard position="start"></Chessboard>
                                        </Grid.Column>
                                        <Grid.Column>
                                                <MoveWindow></MoveWindow>
                                        </Grid.Column>
                                </Grid.Row>
                        </Grid>
                )
        }
}

const mapStateToProps = (state) => {
        return {
                state: state.gameState
        }
}

const mapDispatchToProps = { startMatchmaking }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(Game)