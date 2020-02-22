import * as React from "react";
import { Chess, ChessInstance } from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor

import { connect } from "react-redux";
// import { playerReady, playerMove } from "../../../redux/actionCreators";
import { RootState } from "../../../redux/rootReducer";
import { MatchSession } from "../../../redux/matchStore/models/MatchSession";

/* Chessground */
//@ts-ignore
import Chessground from 'react-chessground'
import '../../../sass/assets/theme.css'
import '../../../sass/assets/chessground.css'

interface Props {
    gameId: string;
    game: MatchSession;
}
interface State {

    position: string;
}

const boardStyle = {
    margin: "auto"
}

class ChessGame extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (this.props.gameId !== "none") {

        } else {
            this.state = {
                position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }
        }
    }

    render() {

        let { position } = this.state;
        return (
            <div className="MainChessboard">

                <Chessground style={boardStyle} fen={position} height={"750px"} width={"750px"} resizable={"true"} />
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

