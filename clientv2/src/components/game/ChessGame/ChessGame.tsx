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

interface Props {
    gameId: string;
    game: MatchSession;
}
interface State {

    chess: ChessInstance;
    orientation: "white" | "black";

    position: string;
    turnColor: "white" | "black";
    movableDestinations: {

    }
}

const boardStyle = {
    margin: "auto"
}

class ChessGame extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (this.props.gameId !== "none") {


        } else {
            //@ts-ignore
            const chess: ChessInstance = new Chess();

            const state = this.makeState(chess);
            this.state = {
                ...state,
                orientation: "white",
                chess: chess,


            }

        }
    }
    makeState = (chess: ChessInstance): any => {
        var state = {
            position: chess.fen(),
            turnColor: toColor(chess),
            movableDestinations: toDests(chess)
        };
        return state;

    }

    // already verified
    onMove = (from: any, to: any) => {
        var moveObject: Chess.ShortMove = { from: from, to: to, promotion: 'q' }
        
        var move = this.state.chess.move(moveObject);
        
        const newState = this.makeState(this.state.chess);
        this.setState({
            ...newState,
        })
    }
    render() {

        let { position, movableDestinations, turnColor, orientation } = this.state;
        return (
            <div className="MainChessboard">

                <Chessground
                    onMove={this.onMove}
                    turnColor={turnColor}
                    movable={{ free: false, dests: movableDestinations, color: orientation, showDests: true }}
                    fen={position}
                    style={boardStyle}
                    height={"740px"}
                    width={"740px"} />
            </div>

        )
    }
}

const mapStateToProps = (state: RootState /*, ownProps*/) => {
    return {
        gameId: state.match.activeMatch,
        game: state.match.matches[state.match.activeMatch]
    }
}
const mapDispatchToProps = { playerReady: () => { }, playerMove: () => { } }


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChessGame)

