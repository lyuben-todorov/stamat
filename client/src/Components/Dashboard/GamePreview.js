import React, { Component } from 'react'
import Chessboard from 'chessboardjsx'
import { Segment, Grid } from 'semantic-ui-react'
import Move from '../Game/MoveWindow/Move'

export class GamePreview extends Component {
    constructor(props) {
        super(props)
    }
    render() {

        let winnerText = "Ongoing";
        if (this.props.game.winner === "draw") {
            winnerText = "DRAW"
        } else if (this.props.game.winner === this.props.game.white) {
            winnerText = "WHITE WINS"
        } else if (this.props.game.winner === this.props.game.black) {
            winnerText = "BLACK WINS"
        }
        return (

            <Grid className="GamePreview" columns={3} divided>
                <Grid.Row stretched>
                    <Grid.Column>
                        <Segment className="Game">
                            <Chessboard
                                position={this.props.game.position}
                                width={200}
                            />
                            <div className ="WinnerText">
                                {winnerText}
                            </div>
                        </Segment>



                    </Grid.Column>
                    <Grid.Column>
                        <Segment>{this.props.game.blackName}</Segment>
                        vs
                        <Segment>{this.props.game.whiteName}</Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment className="MoveBox">
                            <Grid className="MoveGrid" columns={2}>
                                {this.props.game.history.map((message, index) => (
                                    <Move className="Move" onMessageAction={this.onMessageAction} type={"history"} index={index} key={index} message={message}></Move>
                                ))}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default GamePreview
