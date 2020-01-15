import React, { Component } from 'react'
import { Segment, Grid, Icon, Menu, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Move from './MoveWindow/Move'
import { observer } from 'mobx-react'
import Timer from 'react-compound-timer';
import { concedeGame, offerDraw } from '../../redux/actionCreators'
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
            active: "none"
        }
    }

    componentDidUpdate(prevProps) {
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

        if (this.props.game !== prevProps.game) {
            if (this.props.action === "clientMove" || this.props === "opponentMove") {
                let { blackTime, whiteTime } = this.props.game;

                if (this.props.color === "white") {
                    this.userTimer.current.setTime(whiteTime);
                    this.opponentTimer.current.setTime(blackTime);
                } else {

                    this.userTimer.current.setTime(blackTime)
                    this.opponentTimer.current.setTime(whiteTime);
                }

            }
            if (this.props.action === "startGame" || this.props.action === "resumeGame" || this.props.action === "gameReady") {
                let { blackTime, whiteTime, toMove, lastPlayerMoveTime, gameTime } = this.props.game;


                if (toMove === 'w') {
                    whiteTime = gameTime + lastPlayerMoveTime - Date.now()
                } else {
                    blackTime = gameTime + lastPlayerMoveTime - Date.now()
                }

                if (this.props.color === "white") {
                    this.userTimer.current.setTime(whiteTime);
                    this.opponentTimer.current.setTime(blackTime);
                } else {

                    this.userTimer.current.setTime(blackTime)
                    this.opponentTimer.current.setTime(whiteTime);
                }

                if ((this.props.color === "white") == (toMove === 'w')) {
                    this.userTimer.current.start();
                    this.setState({ active: "user" })
                } else {
                    this.opponentTimer.current.start();
                    this.setState({ active: "opponent" })
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
                            {this.props.opponentName ? this.props.opponentName : "None"}
                        </Menu.Item>
                        <Menu.Item>
                            <Button onClick={() => { console.log("asd") }}>
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
                            <Button onClick={() => { this.props.offerDraw(); }}>
                                <Icon size={"large"} name={"handshake outline"}></Icon>
                            </Button>
                        </Menu.Item>
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
        opponentName: state.opponentName,
        game: state.game,
        moveCount: state.moveCount,
        history: state.history,
        action: state.action,
        sessionId: state.sessionId,
        color: state.color
    }
}
const mapDispatchToProps = { concedeGame, offerDraw }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MoveWindow)

