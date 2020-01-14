import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Header, Divider, Dropdown, Icon, Button, Message } from 'semantic-ui-react'
import { startMatchmaking } from '../../../redux/actionCreators';
const chessOptions = [
    {
        text: 'Regular Chess',
        key: "regular",
        icon: "chess"
    }
]

const timeOptions = [
    {
        text: '5 Minutes',
        key: "5",
        icon: "hourglass end"
    },
    {
        text: '10 Minutes',
        key: "10",
        icon: "hourglass half"
    },
    {
        text: '15 Minutes',
        key: '15',
        icon: "hourglass full"
    }
]

const opponentOptions = [
    {
        text: "Player",
        key: "player",
        icon: "user"
    },
    {
        text: "Computer",
        key: "comp",
        icon: "microchip"
    }
]

class Matchmaking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: null,
            modeText: "Game mode",
            modeIcon: "chess board",
            time: null,
            timeText: "Time",
            timeIcon: "time",
            opponentType: null,
            opponentTypeText: "Opponent",
            opponentIcon: "child",
            submitted: false
        }
        this.sendMatchmakingRequest = this.sendMatchmakingRequest.bind(this);
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            if(this.props.gameState !== prevProps.gameState && this.props.gameState === "initiateGame"){
                this.setState({submitted:false})
            }
        }
    }
    onModeChoice = (e, { name }) => {
        if (name.key === "regular") {
            this.setState({ mode: name.key, modeText: name.text, modeIcon: name.icon })
        }
    }
    onTimeChoice = (e, { name }) => {
        if (name.key === "5") {
            this.setState({
                time: name.key,
                timeText: "5 Minutes",
                timeIcon: name.icon
            })
        } else if (name.key === "10") {
            this.setState({
                time: name.key,
                timeText: "10 Minutes",
                timeIcon: name.icon
            })
        } else if (name.key === "15") {
            this.setState({
                time: name.key,
                timeText: "15 Minutes",
                timeIcon: name.icon
            })
        }
    }
    onPlayerChoice = (e, { name }) => {
        if (name.key === "player") {
            this.setState({
                opponentType: name.key,
                opponentTypeText: "Player",
                opponentIcon: name.icon
            })
        } else if (name.key === "comp") {
            this.setState({
                opponentType: name.key,
                opponentTypeText: "Computer",
                opponentIcon: name.icon
            })
        }
    }
    sendMatchmakingRequest() {
        let { opponentType, mode, time } = this.state;
        if (opponentType && mode && time) {

            this.props.startMatchmaking({ opponentType, mode, time });
            this.setState({ submitted: true })
        } else {
            this.setState({ errorState: true });
        }
    }
    render() {
        return (
            <div className="MatchmakingBox">
                <Header>Game Options</Header>
                <Divider />
                <Dropdown
                    className="Dropdown icon"
                    text={this.state.modeText}
                    icon={this.state.modeIcon + " mainIcon"}
                    floating
                    labeled
                    button>

                    <Dropdown.Menu >
                        {chessOptions.map((option) => (
                            <Dropdown.Item name={option} onClick={this.onModeChoice} key={option.key} >
                                {option.text}
                                <Icon size={"large"} name={option.icon} />
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>

                </Dropdown>

                <Dropdown
                    className="Dropdown icon"
                    text={this.state.timeText}
                    icon={this.state.timeIcon + " mainIcon"}
                    floating
                    labeled
                    button>

                    <Dropdown.Menu >
                        {timeOptions.map((option) => (
                            <Dropdown.Item name={option} onClick={this.onTimeChoice} key={option.key} >
                                {option.text}
                                <Icon size={"large"} name={option.icon} />
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>

                </Dropdown>

                <Dropdown
                    className="Dropdown icon"
                    text={this.state.opponentTypeText}
                    icon={this.state.opponentIcon + " mainIcon"}
                    floating
                    labeled
                    button>

                    <Dropdown.Menu >
                        {opponentOptions.map((option) => (
                            <Dropdown.Item name={option} onClick={this.onPlayerChoice} key={option.key} >
                                {option.text}
                                <Icon size={"large"} name={option.icon} />
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>

                </Dropdown>
                <Message className info hidden={!this.state.errorState}> You have unselected options</Message>
                <Divider></Divider>
                <Button loading={this.state.submitted} className="SubmitButton" onClick={this.sendMatchmakingRequest} type="submit" color="orange">Play</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userType: state.userType,
        gameState: state.gameState,
        sessionId: state.sessionId,
        opponentName: state.opponentName,
        winner: state.winner,
        username: state.username,
    }
}

const mapDispatchToProps = { startMatchmaking }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Matchmaking)