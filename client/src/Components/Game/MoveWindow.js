import React, { Component } from 'react'
import { Segment, Grid, Icon, Menu, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Move from './MoveWindow/Move'
import { observer } from 'mobx-react'
import Timer from 'react-compound-timer';
import { concedeGame, offerDraw, replyDraw } from '../../redux/actionCreators'
@observer
class MoveWindow extends Component {
    constructor(props) {
        super(props);
        this.userTimer = React.createRef();
        this.opponentTimer = React.createRef();


        this.state = {
            gameTime: 600000,
            opponentTime: 600000,
            userTime: 600000,
            active: "none",
            offeringDraw: false,
            playerOfferingDraw: false,
            opponent: "None"
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.action !== prevProps.action || this.props.game !== prevProps.game) {

            if (this.props.moveCount !== prevProps.moveCount) {
                if (this.props.action === "clientMove") {
                    this.userTimer.current.stop()
                    this.opponentTimer.current.start();
                    this.setState({ active: "opponent" })

                } else if (this.props.action === "opponentMove") {

                    this.userTimer.current.start()
                    this.opponentTimer.current.stop();
                    this.setState({ active: "user" })
                }
            }
            if (this.props.action === "gameOver") {
                this.userTimer.current.stop();
                this.opponentTimer.current.stop()
                this.setState({ playerOfferingDraw: false, gameOver: true })
            }
            if (this.props.action === "offerDraw") {
                this.setState({ offeringDraw: true });
            } else if (this.props.action === "repliedDraw") {
                this.setState({ offeringDraw: false, playerOfferingDraw: false });
            } else if (this.props.action === "playerOfferDraw") {
                this.setState({ playerOfferingDraw: true })
            }
            if (this.props.game !== prevProps.game) {
                if (this.props.action === "clientMove" || this.props === "opponentMove") {
                    let { blackTime, whiteTime } = this.props.game;
                    if (this.props.color.charAt(0) === 'w') {
                        this.userTimer.current.setTime(whiteTime);
                        this.opponentTimer.current.setTime(blackTime);
                    } else {

                        this.userTimer.current.setTime(blackTime)
                        this.opponentTimer.current.setTime(whiteTime);
                    }

                }
                if (this.props.action === "startGame" || this.props.action === "resumeGame" || this.props.action === "gameReady" || this.props.action === "initiateGame") {
                    let { blackTime, whiteTime, toMove, lastPlayerMoveTime, gameTime, blackName, whiteName } = this.props.game;

                    console.log(whiteTime)

                    let opponent = this.props.color.charAt(0) === 'w' ? this.props.game.blackName : this.props.game.whiteName;
                    if (lastPlayerMoveTime) {

                        if (toMove === 'w') {
                            whiteTime = gameTime + lastPlayerMoveTime - Date.now()
                        } else {
                            blackTime = gameTime + lastPlayerMoveTime - Date.now()
                        }
                    }
                    if (this.props.color.charAt(0) === 'w') {
                        this.userTimer.current.setTime(whiteTime);
                        this.opponentTimer.current.setTime(blackTime);
                    } else {

                        this.userTimer.current.setTime(blackTime)
                        this.opponentTimer.current.setTime(whiteTime);
                    }

                    if ((this.props.color.charAt(0) === 'w') === (toMove === 'w')) {
                        this.userTimer.current.start();

                        this.setState({ active: "user", opponent: opponent })
                    } else {
                        this.opponentTimer.current.start();
                        this.setState({ active: "opponent", opponent: opponent })
                    }
                }

            }
        }
    }
    renderNumbers(time) {
        return time < 10 ? `0${time}` : `${time}`
    }

    render() {
        return (

            <Grid className="MoveWindow">

                <div className={this.state.active === "opponent" ? "Timer active" : "Timer"}>
                    <Timer ref={this.opponentTimer} startImmediately={false} timeToUpdate={1000} initialTime={this.state.opponentTime} direction={"backward"} >
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
                        <Menu.Item className="UserName">
                            <Icon name={"circle"} color={"green"}></Icon>
                            {this.state.opponent}
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
                        {this.props.history.map((message, index) => (
                            <Move className="Move" onMessageAction={this.onMessageAction} type={"history"} index={index} key={index} message={message}></Move>
                        ))}
                    </Grid>
                </Segment>

                <Segment className="PlayerBox">

                    <Menu>
                        <Menu.Item className="User">
                            <Icon name={"circle"} color={"green"}></Icon>
                            <div className="Username">
                                {this.props.sessionStore.username}
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
                    <Timer ref={this.userTimer} startImmediately={false} timeToUpdate={1000} initialTime={this.state.userTime} direction={"backward"} >
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
const mapStateToProps = (state /*, ownProps*/) => {
    return {
        game: state.game,
        moveCount: state.moveCount,
        history: state.history,
        action: state.action,
        sessionId: state.sessionId,
        color: state.color
    }
}
const mapDispatchToProps = { concedeGame, offerDraw, replyDraw }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MoveWindow)

