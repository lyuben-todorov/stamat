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
import { concede, offerDraw, replyDraw } from '../../../redux/matchStore/matchActions';
interface State {
    proponentTimer: React.RefObject<any>;
    opponentTimer: React.RefObject<any>;

    gameTime: number;

    proponentTime: number;
    opponentTime: number;

    active: "proponent" | "opponent" | "none";

    proOfferingDraw: true | false;
    oppOfferingDraw: true | false;

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

    concedeGame: typeof concede;
    replyDraw: typeof replyDraw;
    offerDraw: typeof offerDraw;

}

class MoveWindow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            proponentTimer: React.createRef(),
            opponentTimer: React.createRef(),
            gameTime: this.props.game ? this.props.game.gameTime : 600000,
            opponentTime: this.props.game ? this.props.game.opponent.timeLeft : 600000,
            proponentTime: this.props.game ? this.props.game.proponent.timeLeft : 600000,
            active: "none",
            proOfferingDraw: false,
            oppOfferingDraw: false,
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

                        this.state.proponentTimer.current.stop()
                        this.state.opponentTimer.current.start();

                        this.setState({ active: "opponent" })

                        break;
                    case "server_update":
                        {

                            var opponentTime = this.props.game.opponent.timeLeft;
                            var proponentTime = this.props.game.proponent.timeLeft;

                            this.state.proponentTimer.current.start()
                            this.state.opponentTimer.current.stop();

                            this.state.proponentTimer.current.setTime(proponentTime);
                            this.state.opponentTimer.current.setTime(opponentTime);

                            this.setState({ active: "proponent" })
                        }
                        break;
                    case "starting":
                        console.log("asd")
                        this.state.proponentTimer.current.setTime(600000);
                        this.state.opponentTimer.current.setTime(600000);

                        break;
                    case "continue":
                        {

                            var oppTime = this.props.game.opponent.timeLeft;
                            var proTime = this.props.game.proponent.timeLeft;


                            if (this.props.game.lastPlayerMoveTime !== -1) {
                                if (this.props.game.proponent.color === this.props.game.onMove) {

                                    proTime += this.props.game.lastPlayerMoveTime - Date.now();

                                } else {

                                    oppTime += this.props.game.lastPlayerMoveTime - Date.now();

                                }
                            }


                            this.state.opponentTimer.current.setTime(oppTime);
                            this.state.proponentTimer.current.setTime(proTime);

                            if (this.props.game.lastPlayerMoveTime !== -1) {

                                if (this.props.game.proponent.color === this.props.game.onMove) {

                                    this.state.proponentTimer.current.start();
                                    this.state.opponentTimer.current.stop();

                                    this.setState({ active: "proponent" })
                                } else {

                                    this.state.opponentTimer.current.start();
                                    this.state.proponentTimer.current.stop();

                                    this.setState({ active: "opponent" })

                                }
                            }
                        }
                        break;

                    case "game_over":
                        {

                            this.state.proponentTimer.current.stop();
                            this.state.opponentTimer.current.stop();

                            this.setState({ proOfferingDraw: false, gameOver: true, active: "none" });

                        }
                        break;
                    case "pro_offer_draw":

                        this.setState({ proOfferingDraw: true });

                        break;
                    case "opp_offer_draw":

                        this.setState({ oppOfferingDraw: true });

                        break;
                    case "opp_reply_draw":

                        this.setState({ proOfferingDraw: false });
                    case "ack":
                        break;
                }
            }
        }
    }

    renderNumbers(time: number) {
        // no negative time; shouldn't happen
        time = time < 0 ? 0 : time;
        // formatting
        return time < 10 ? `0${time}` : `${time}`

    }

    offerDraw() {
        this.setState({ proOfferingDraw: true });
        this.props.offerDraw(this.props.gameId);
    }

    replyDraw(reply: boolean) {
        if (reply) {
            this.props.replyDraw(true, this.props.gameId);
        } else {
            this.setState({ oppOfferingDraw: false });
            this.props.replyDraw(false, this.props.gameId);
        }
    }

    render() {
        var opponentName = this.props.game ? this.props.game.opponent.name : "None";
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
                            <Button color={"red"} onClick={() => this.props.concedeGame(this.props.gameId)}>
                                <Icon size={"large"} name={"flag outline"}></Icon>
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                color={this.state.oppOfferingDraw ? "green" : "grey"}
                                loading={this.state.proOfferingDraw}
                                onClick={() => {
                                    this.state.oppOfferingDraw ?
                                        this.replyDraw(true) :
                                        this.offerDraw();
                                }}>

                                <Icon size={"large"} name={this.state.proOfferingDraw ? "thumbs up" : "handshake outline"}></Icon>

                            </Button>
                        </Menu.Item>
                        {
                            this.state.oppOfferingDraw ?
                                <Menu.Item>
                                    <Button color={"red"} onClick={() => { this.replyDraw(false); }}>
                                        <Icon size={"large"} name={"thumbs down"}></Icon>
                                    </Button>
                                </Menu.Item>
                                : ""
                        }

                    </Menu>
                </Segment>
                <div className={this.state.active === "proponent" ? "Timer active" : "Timer"}>
                    <Timer ref={this.state.proponentTimer} startImmediately={false} timeToUpdate={1000} initialTime={this.state.proponentTime} direction={"backward"} >
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

const mapDispatchToProps = { concedeGame: concede, offerDraw: offerDraw, replyDraw: replyDraw }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MoveWindow)

