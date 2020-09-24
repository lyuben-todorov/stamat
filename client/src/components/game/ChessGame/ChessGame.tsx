import * as React from "react";
import { ChessInstance } from "chess.js";
import * as Chess from 'chess.js';

import { connect } from "react-redux";
// import { playerReady, playerMove } from "../../../redux/actionCreators";
import { RootState } from "../../../redux/rootReducer";
import { MatchSession } from "../../../redux/matchStore/models/MatchSession";

/* Chessground */
//@ts-ignore
import Chessground from 'react-chessground'
import '../../../sass/assets/theme.css'
import '../../../sass/assets/chessground.css'
import toDests from "../../../util/toDest";
import toColor from "../../../util/toColor";
import { ClientState, acknowledge } from "../../../redux/clientStateStore/clientStateReducer";
import { playerMove } from "../../../redux/matchStore/matchActions";

interface Props {
    gameId: string;
    game: MatchSession;
    clientState: ClientState;

    playerMove: typeof playerMove
    acknowledge: typeof acknowledge
}
interface State {

    chess: ChessInstance;
    orientation: "white" | "black";

    position: string;
    turnColor: "white" | "black" | "undefined";
    movableDestinations: {

    }
    lastMove?: []
}

const boardStyle = {
    margin: "auto"
}

class ChessGame extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (this.props.clientState.gameState === "ongoing") {
            const game = this.props.game;
            //@ts-ignore broken chess.js types
            const chess: ChessInstance = new Chess(game.position);

            const state = this.makeState(chess);
            this.state = {
                ...state,
                orientation: game.proponent.color,
                chess: chess,
            }

        } else {

            //@ts-ignore broken chess.js types
            const chess: ChessInstance = new Chess();

            const state = this.makeState(chess);
            this.props
            this.state = {
                ...state,
                turnColor: "undefined",
                orientation: "white",
                chess: chess,
            }
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps !== this.props) {
            if (prevProps.clientState.gameState !== this.props.clientState.gameState) {

                switch (this.props.clientState.gameState) {
                    case "starting":
                        {

                            const game = this.props.game;

                            //@ts-ignore
                            const chess: ChessInstance = new Chess();
                            const state = this.makeState(chess);
                            this.setState({
                                ...state,
                                orientation: game.proponent.color,
                                chess: chess,
                            })
                            this.props.acknowledge();
                        }
                        break;
                    case "server_update":
                        {

                            var game = this.props.game;
                            var chess = this.state.chess;

                            chess.move(game.moveHistory[game.moveHistory.length - 1]);
                            const state = this.makeState(chess);
                            this.setState({
                                ...state,
                                orientation: game.proponent.color,
                                chess: chess,
                            })
                            this.props.acknowledge();
                        }
                        break;
                    case "continue":
                        {

                            const game = this.props.game;

                            //@ts-ignore
                            const chess: ChessInstance = new Chess(game.position);
                            const state = this.makeState(chess);
                            this.setState({
                                ...state,
                                orientation: game.proponent.color,
                                chess: chess,
                            })
                            this.props.acknowledge();

                            this.props.acknowledge();
                        }
                        break;
                    case "game_over":
                        {
                            this.setState({

                                lastMove: []
                            })
                            this.props.acknowledge();

                        }
                        break;
                }
            }
        }
    }
    makeState = (chess: ChessInstance): any => {
        var turnColor;

        if (this.props.game) {
            turnColor = this.props.game.proponent.color === toColor(chess) ? toColor(chess) : "undefined";
        } else {
            turnColor = "white";
        }

        var state = {
            position: chess.fen(),
            turnColor: turnColor,
            movableDestinations: toDests(chess)
        };

        return state;

    }

    // already verified
    onMove = (from: any, to: any) => {
        if (this.props.gameId) {

            var moveObject: Chess.ShortMove = { from: from, to: to, promotion: 'q' }

            var move = this.state.chess.move(moveObject);

            const newState = this.makeState(this.state.chess);

            this.props.playerMove(move, this.props.gameId);
            this.setState({
                ...newState,
            })
        }
    }
    render() {

        let { position, movableDestinations, turnColor, orientation, lastMove } = this.state;
        return (
            <div className="MainChessboard">

                <Chessground
                    onMove={this.onMove}
                    turnColor={turnColor}
                    movable={{ free: false, dests: movableDestinations, color: turnColor, showDests: true }}
                    orientation={orientation}
                    fen={position}
                    style={boardStyle}
                    height={"740px"}
                    width={"740px"}
                    lastMove={lastMove} />
            </div>

        )
    }
}

const mapStateToProps = (state: RootState /*, ownProps*/) => {
    return {
        gameId: state.match.activeMatch,
        game: state.match.matches[state.match.activeMatch],
        clientState: state.clientState,
    }
}
const mapDispatchToProps = {
    playerReady: () => { },
    playerMove: playerMove,
    acknowledge: acknowledge
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChessGame)

