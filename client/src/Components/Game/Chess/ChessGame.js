import React, { Component } from "react";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor

import Chessboard from "chessboardjsx";
import { connect } from "react-redux";
import { playerReady, playerMove } from "../../../redux/actionCreators";
import { observer } from "mobx-react";

@observer
class ChessGame extends Component {
        constructor(props) {
                super(props)

                this.state = {
                        position: "start",
                        // square styles for active drop square
                        dropSquareStyle: {},
                        // custom square styles
                        squareStyles: {},
                        // square with the currently clicked piece
                        pieceSquare: 'none',
                        // currently clicked square
                        square: "",
                        // array of past game moves
                        history: [],
                        // orientation from player prespective
                        orientation: 'white'
                }
                console.log(this.props.sessionStore.sessionId)
                this.updateGameAndServerState = this.updateGameAndServerState.bind(this);
                this.updateGameState = this.updateGameState.bind(this);
                this.onMoveEvent = this.onMoveEvent.bind(this);

        }


        componentDidMount() {
                this.game = new Chess();
        }
        componentDidUpdate(prevProps) {

                if (this.props.gameState !== prevProps.gameState) {
                        // called when state receives new game object and sets gamestate to initiategame
                        if (this.props.gameState === "initiateGame") {
                                console.log("ANUS ")
                                let { gameId, playerOne, playerTwo, white, toMove, position, history } = this.props.game
                                console.log(this.props.game);
                                this.setState({
                                        orientation: white === this.props.sessionStore.sessionId ? 'white' : 'black',
                                        playerColor: white === this.props.sessionStore.sessionId ? 'white' : 'black',
                                        gameId: gameId,
                                        playerOne: playerOne,
                                        playerTwo: playerTwo,
                                        // changing props
                                        position: position,
                                        toMove: toMove,
                                        history: history
                                })
                                this.game = new Chess();

                                this.props.playerReady();

                                return
                        }
                }

                // this should happen when opponent moves
                if (this.props.gameState === "ongoing" && this.props.game !== prevProps.game) {
                        let { position, history, squareStyles, toMove } = this.props.game
                        this.setState({
                                toMove: toMove,
                                position: position,
                                history: history,
                                squareStyles: squareStyles,
                                pieceSquare: 'none'
                        }, () => {
                                this.game.move(this.props.move)
                                if(this.game.game_over()){
                                        this.setState({toMove:"none"});
                                }
                        })
                }

        }
        updateGameAndServerState(updatedGameState, moveObject) {
                this.updateGameState(updatedGameState);
                this.props.playerMove({ game: updatedGameState, move: moveObject, gameId: this.state.gameId, gameOver:false });
        }
        updateGameState(updatedGameState) {
                this.setState(updatedGameState);

        }
        // keep clicked square style and remove hint squares
        removeHighlightSquare = () => {
                this.setState(({ pieceSquare, history }) => ({
                        squareStyles: squareStyling({ pieceSquare, history })
                }));
        };

        // show possible moves
        highlightSquare = (sourceSquare, squaresToHighlight) => {
                const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
                        (sourceSquare, squaresToHighlight) => {
                                return {
                                        ...sourceSquare,
                                        ...{
                                                [squaresToHighlight]: {
                                                        background:
                                                                "radial-gradient(circle, rgba(120,120,120,0.5) 30%, transparent 35%)",
                                                        borderRadius: "40%"
                                                }
                                        },
                                        ...squareStyling({
                                                history: this.state.history,
                                                pieceSquare: this.state.pieceSquare
                                        })
                                };
                        },
                        {}
                );

                this.setState(({ squareStyles }) => ({
                        squareStyles: { ...squareStyles, ...highlightStyles }
                }));
        };

        onMoveEvent = (sourceSquare, targetSquare) => {
                if (this.props.sessionStore.sessionId === this.state.toMove) {


                        let moveObject = {
                                from: sourceSquare,
                                to: targetSquare,
                                promotion: "q" // always promote to a queen for example simplicity
                        };
                        // see if the move is legal
                        let move = this.game.move(moveObject);

                        // illegal move
                        if (move === null) {
                                console.log("illeagl");
                                return;
                        }
                        let { history, pieceSquare } = this.state;

                        const gameState = {
                                position: this.game.fen(),
                                history: this.game.history({ verbose: true }),
                                squareStyles: squareStyling({ pieceSquare, history }),
                                pieceSquare: "",
                                toMove: this.props.oponentId
                        }
                        this.updateGameAndServerState(gameState, moveObject, this.game.game_over());
                } else {
                        console.log("not your turn");
                        return;
                }
        }

        onMouseOverSquare = square => {
                // get list of possible moves for this square
                let moves = this.game.moves({
                        square: square,
                        verbose: true
                });

                // exit if there are no moves available for this square
                if (moves.length === 0) return;

                let squaresToHighlight = [];
                for (var i = 0; i < moves.length; i++) {
                        squaresToHighlight.push(moves[i].to);
                }

                this.highlightSquare(square, squaresToHighlight);
        };

        onMouseOutSquare = square => this.removeHighlightSquare(square);

        // central squares get diff dropSquareStyles
        onDragOverSquare = square => {
                this.setState({
                        dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
                });
        };

        onDrop = ({ sourceSquare, targetSquare }) => {
                // is it the player's turn; this is enforced on the server-side as well
                this.onMoveEvent(sourceSquare, targetSquare);
        };
        onSquareClick = square => {
                if (this.state.pieceSquare === 'none') {

                        this.setState(({ history }) => ({
                                squareStyles: squareStyling({ pieceSquare: square, history }),
                                pieceSquare: square
                        }));
                        return;
                } else if (this.state.pieceSquare !== square) {
                        let source = this.state.pieceSquare;
                        this.onMoveEvent(source, square);
                }
        };

        onSquareRightClick = square =>
                this.setState({
                        squareStyles: { [square]: { backgroundColor: "deepPink" } }
                });

        render() {
                const { position, dropSquareStyle, squareStyles, orientation } = this.state;

                return (
                        <Chessboard
                                id="mainChessboard"
                                width={700}
                                boardStyle={boardStyle}
                                position={position}
                                orientation={orientation}
                                onDrop={this.onDrop}
                                transitionDuration={300}
                                onMouseOverSquare={this.onMouseOverSquare}
                                onMouseOutSquare={this.onMouseOutSquare}
                                squareStyles={squareStyles}
                                dropSquareStyle={dropSquareStyle}
                                onDragOverSquare={this.onDragOverSquare}
                                onSquareClick={this.onSquareClick}
                                onSquareRightClick={this.onSquareRightClick}
                        />
                )
        }
}

const mapStateToProps = (state /*, ownProps*/) => {
        return {
                gameState: state.gameState,
                game: state.game,
                move: state.move,
                oponentId: state.oponentId
        }
}
const mapDispatchToProps = { playerReady, playerMove }

export default connect(
        mapStateToProps,
        mapDispatchToProps
)(ChessGame)

const squareStyling = ({ pieceSquare, history }) => {
        const sourceSquare = history.length && history[history.length - 1].from;
        const targetSquare = history.length && history[history.length - 1].to;

        return {
                [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                ...(history.length && {
                        [sourceSquare]: {
                                backgroundColor: "rgba(255, 255, 0, 0.4)"
                        }
                }),
                ...(history.length && {
                        [targetSquare]: {
                                backgroundColor: "rgba(255, 255, 0, 0.4)"
                        }
                })
        };
};
const boardStyle = {
        margin: "auto"
}