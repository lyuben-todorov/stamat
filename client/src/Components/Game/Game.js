import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Grid } from 'semantic-ui-react';
import MoveWindow from './MoveWindow';
import ChessGame from './Chess/ChessGame';
import SessionStore from '../../Mobx/SessionStore';
import MenuWindow from './MenuWindow';
import '../_sass/Game.scss'
import { connect } from 'react-redux';
@observer
class Game extends Component {

        componentDidUpdate(prevPros){
                if(this.props !== prevPros){
                        if(this.props.action === "initiate"){
                                window.location.reload()
                        }
                }
        }
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

const mapStateToProps = (state) => ({
        action:state.action
})

const mapDispatchToProps = {
        
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

