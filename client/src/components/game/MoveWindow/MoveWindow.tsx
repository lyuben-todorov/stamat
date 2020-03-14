import * as React from 'react'
import { Segment, Grid, Icon, Menu, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Move from './Move'
import Timer from 'react-compound-timer';
import { RootState } from '../../../redux/rootReducer';
import { MatchSession } from '../../../redux/matchStore/models/MatchSession';
import { ClientState } from '../../../redux/clientStateStore/clientStateReducer';
import UserSession from '../../../redux/sessionStore/models/UserSession';
import * as chess from "chess.js";

// import { concedeGame, offerDraw, replyDraw } from '../../redux/actionCreators'
interface State {
    userTimer: React.RefObject<any>;
    opponentTimer: React.RefObject<any>;

    gameTime: number;

    opponentTime: number;
    userTime: number;

    active: string;

    offeringDraw: true | false;
    playerOfferingDraw: true | false;

    opponent: string;

    gameOver: true | false;

    moveHistory: chess.Move[]
}
interface Props {

    //to be impl.
    gameId: string;
    game: MatchSession;
    clientState: ClientState;
    userSession: UserSession;
    lastMove: chess.Move

    concedeGame: Function;
    replyDraw: Function;
    offerDraw: Function;

}

class MoveWindow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            userTimer: React.createRef(),
            opponentTimer: React.createRef(),
            gameTime: this.props.game ? this.props.game.gameTime : 600000,
            opponentTime: this.props.game ? this.props.game.opponent.timeLeft : 600000,
            userTime: this.props.game ? this.props.game.proponent.timeLeft : 600000,
            active: "none",
            offeringDraw: false,
            playerOfferingDraw: false,
            opponent: "None",
            gameOver: false,
            moveHistory: props.game ? props.game.moveHistory : []
        }

    }


    componentDidUpdate(prevProps: Props) {
        if (this.props !== prevProps) {
            if (this.props.clientState.gameState !== prevProps.clientState.gameState) {
                switch (this.props.clientState.gameState) {
                    case "client_update":
                        this.state.userTimer.current.stop()
                        this.state.opponentTimer.current.start();
                        this.setState({ active: "opponent" })
                        break;
                    case "server_update":
                        {

                            var opponentTime = this.props.game.opponent.timeLeft;
                            var proponentTime = this.props.game.proponent.timeLeft;

                            this.state.userTimer.current.start()
                            this.state.opponentTimer.current.stop();

                            this.state.userTimer.current.setTime(proponentTime);
                            this.state.opponentTimer.current.setTime(opponentTime);
                            this.setState({ active: "user" })
                        }
                        break;
                    case "starting":
                        break;
                    case "continue":
                        {
                            this.state.opponentTimer.current.setTime(this.props.game.opponent.timeLeft)
                            this.state.userTimer.current.setTime(this.props.game.proponent.timeLeft);
                        }
                        break;

                    case "ack":
                        break;
                }
            }

            //     if (this.props.action === "gameOver") {
            //         this.state.userTimer.current.stop();
            //         this.state.opponentTimer.current.stop()
            //         this.setState({ playerOfferingDraw: false, gameOver: true })
            //     }
            //     if (this.props.action === "offerDraw") {
            //         this.setState({ offeringDraw: true });
            //     } else if (this.props.action === "repliedDraw") {
            //         this.setState({ offeringDraw: false, playerOfferingDraw: false });
            //     } else if (this.props.action === "playerOfferDraw") {
            //         this.setState({ playerOfferingDraw: true })
            //     }
            //     if (this.props.game !== prevProps.game) {
            //         if (this.props.action === "clientMove" || this.props.action === "opponentMove") {
            //             let { blackTime, whiteTime } = this.props.game;
            //             if (this.props.color.charAt(0) === 'w') {
            //                 this.state.userTimer.current.setTime(whiteTime);
            //                 this.state.opponentTimer.current.setTime(blackTime);
            //             } else {

            //                 this.state.userTimer.current.setTime(blackTime)
            //                 this.state.opponentTimer.current.setTime(whiteTime);
            //             }

            //         }
            //         if (this.props.action === "startGame" || this.props.action === "resumeGame" || this.props.action === "gameReady" || this.props.action === "initiateGame") {
            //             let { blackTime, whiteTime, toMove, lastPlayerMoveTime, gameTime, blackName, whiteName } = this.props.game;

            //             console.log(whiteTime)

            //             let opponent = this.props.color.charAt(0) === 'w' ? this.props.game.blackName : this.props.game.whiteName;
            //             if (lastPlayerMoveTime) {

            //                 if (toMove === 'w') {
            //                     whiteTime = gameTime + lastPlayerMoveTime - Date.now()
            //                 } else {
            //                     blackTime = gameTime + lastPlayerMoveTime - Date.now()
            //                 }
            //             }
            //             if (this.props.color.charAt(0) === 'w') {
            //                 this.state.userTimer.current.setTime(whiteTime);
            //                 this.state.opponentTimer.current.setTime(blackTime);
            //             } else {

            //                 this.state.userTimer.current.setTime(blackTime)
            //                 this.state.opponentTimer.current.setTime(whiteTime);
            //             }

            //             if ((this.props.color.charAt(0) === 'w') === (toMove === 'w')) {
            //                 this.state.userTimer.current.start();

            //                 this.setState({ active: "user", opponent: opponent })
            //             } else {
            //                 this.state.opponentTimer.current.start();
            //                 this.setState({ active: "opponent", opponent: opponent })
            //             }
            //         }

            //     }
        }
    }
    renderNumbers(time: number) {
        return time < 10 ? `0${time}` : `${time}`
    }

    render() {
        let opponentName = this.props.game ? this.props.game.opponent.name : "None";
        return (

            <Grid className="MoveWindow">

                <div className={this.state.active === "opponent" ? "Timer active" : "Timer"}>
                    <Timer ref={this.state.opponentTimer} startImmediately={false} timeToUpdate={1000} initialTime={this.state.opponentTime} direction={"backward"} >
                        {() => (
                            <div className="CenterContainer">
                                <div className="TimerNumber">
                                    <Timer.Minutes formatValue={this.renderNumbers} />  :
                                </div>
                                <div className="TimerNumber Seconds">
                                    <Timer.Seconds formatValue={this.renderNumbers} />
                                </div>
                            </div>
                        )
                        }
                    </Timer>
                </div>
                <Segment className="PlayerBox">
                    <Menu>
                        <Menu.Item className="User">
                            <Icon name={"circle"} color={"green"}></Icon>
                            <div className="Username">
                                {opponentName}
                            </div>
                        </Menu.Item>
                        <Menu.Item>
                            <Button onClick={() => { }}>
                                <Icon size={"large"} name={"add user"}></Icon>
                            </Button>
                        </Menu.Item>
                    </Menu>
                </Segment>

                <Segment className="MoveBox">
                    <Grid className="MoveGrid" columns={2}>
                        {this.props.game ? this.props.game.moveHistory.map((message: any, index: number) => (
                            <Move className="Move" type={"history"} index={index} key={index} message={message}></Move>
                        )) : ""}
                    </Grid>
                </Segment>

                <Segment className="PlayerBox">

                    <Menu>
                        <Menu.Item className="User">
                            <Icon name={"circle"} color={"green"}></Icon>
                            <div className="Username">
                                {this.props.userSession.username}
                            </div>
                        </Menu.Item>
                        <Menu.Item>
                            <Button color={"red"} onClick={() => this.props.concedeGame()}>
                                <Icon size={"large"} name={"flag outline"}></Icon>
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                color={this.state.offeringDraw ? "green" : "grey"}
                                loading={this.state.playerOfferingDraw}
                                onClick={() => { this.state.offeringDraw ? this.props.replyDraw(true) : this.props.offerDraw(); }}>

                                <Icon size={"large"} name={this.state.offeringDraw ? "thumbs up" : "handshake outline"}></Icon>

                            </Button>
                        </Menu.Item>
                        {
                            this.state.offeringDraw ?
                                <Menu.Item>
                                    <Button color={"red"} onClick={() => { this.props.replyDraw(false); }}>
                                        <Icon size={"large"} name={"thumbs down"}></Icon>
                                    </Button>
                                </Menu.Item>
                                :
                                ""
                        }

                    </Menu>
                </Segment>
                <div className={this.state.active === "user" ? "Timer active" : "Timer"}>
                    <Timer ref={this.state.userTimer} startImmediately={false} timeToUpdate={1000} initialTime={this.state.userTime} direction={"backward"} >
                        {() => (
                            <div className="CenterContainer">
                                <div className="TimerNumber">
                                    <Timer.Minutes formatValue={this.renderNumbers} />  :
                                </div>
                                <div className="TimerNumber Seconds">
                                    <Timer.Seconds formatValue={this.renderNumbers} />
                                </div>
                            </div>
                        )}
                    </Timer>
                </div>

            </Grid>
        )
    }

}
const mapStateToProps = (state: RootState) => ({
    gameId: state.match.activeMatch,
    game: state.match.matches[state.match.activeMatch],
    clientState: state.clientState,
    userSession: state.session,
    lastMove: state.match.lastMove
})

const mapDispatchToProps = { concedeGame: () => { }, offerDraw: () => { }, replyDraw: () => { } }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MoveWindow)

