import React, { Component } from "react";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor

import Chessboard from "chessboardjsx";
import { connect } from "react-redux";
import { playerReady } from "../../../redux/actionCreators";

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
                        pieceSquare: "",
                        // currently clicked square
                        square: "",
                        // array of past game moves
                        history: [],
                        // orientation from player prespective
                        orientation: 'white'
                }
                this.updateGameAndServerState = this.updateGameAndServerState.bind(this);
                this.updateGameState = this.updateGameState.bind(this);

        }


        componentDidMount() {
                this.game = new Chess();
        }
        componentDidUpdate(prevProps) {

                if (this.props.gameState !== prevProps.gameState) {
                        // called when state receives new game object and sets gamestate to initiategame
                        if (this.props.gameState === "initiateGame") {
                                let { gameId, playerOne, playerTwo, white, toMove, boardState, history } = this.props.game
                                this.setState({
                                        orientation: white === this.props.playerId ? 'white' : 'black',
                                        position: boardState,
                                        gameId: gameId,
                                        playerOne: playerOne,
                                        playerTwo: playerTwo,
                                        toMove: toMove === this.props.playerId ? true : false,
                                        history: history
                                })

                                this.props.playerReady();

                                return
                        }
                }
                if (this.props.game !== prevProps.game) {
                }

        }
        updateGameAndServerState(updatedGameState) {
                this.updateGameStates(updatedGameState)
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

        onDrop = ({ sourceSquare, targetSquare }) => {

                // is it the player's turn; this is enforced on the server-side as well
                if (this.state.toMove) {

                        // see if the move is legal
                        let move = this.game.move({
                                from: sourceSquare,
                                to: targetSquare,
                                promotion: "q" // always promote to a queen for example simplicity
                        });

                        // illegal move
                        if (move === null) return;

                        let { history, pieceSquare } = this.state;

                        const gameState = {
                                position: this.game.fen(),
                                history: this.game.history({ verbose: true }),
                                squareStyles: squareStyling({ pieceSquare, history })
                        }
                        this.updateGameStates(gameState);
                } else {
                        console.log("not your turn");
                        return;
                }

        };

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

        onSquareClick = square => {
                this.setState(({ history }) => ({
                        squareStyles: squareStyling({ pieceSquare: square, history }),
                        pieceSquare: square
                }));

                let move = this.game.move({
                        from: this.state.pieceSquare,
                        to: square,
                        promotion: "q" // always promote to a queen for example simplicity
                });

                // illegal move
                if (move === null) return;


                let gameState = {
                        fen: this.game.fen(),
                        history: this.game.history({ verbose: true }),
                        pieceSquare: ""
                }
                this.updateGameStates(gameState);
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
                                position={position}
                                orientation={orientation}
                                onDrop={this.onDrop}
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
                playerId: state.socketId,
                gameState: state.gameState,
                game: state.game
        }
}
const mapDispatchToProps = { playerReady }

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
