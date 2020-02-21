import * as React from 'react'
import { connect } from 'react-redux'
import { Header, Divider, Dropdown, Icon, Button, Message, DropdownItemProps } from 'semantic-ui-react'
// import { startMatchmaking } from '../../../redux/actionCreators';
import { RootState } from '../../../../redux/rootReducer';
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

interface Props {
    gameState: string;

    startMatchmaking: Function;
}
interface State {
    mode: string,
    modeText: string,
    modeIcon: string,
    time: string,
    timeText: string,
    timeIcon: string,
    opponentType: string,
    opponentTypeText: string,
    opponentIcon: string,

    errorState: true | false,
    submitted: boolean
}

class Matchmaking extends React.Component<Props, State> {
    constructor(props: Props) {
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
            submitted: false,
            errorState: false
        }
        this.sendMatchmakingRequest = this.sendMatchmakingRequest.bind(this);
    }

    componentDidMount() {
        let defaultMode = {
            text: 'Regular Chess',
            key: "regular",
            icon: "chess"
        }
        let defaultTime = {
            text: '10 Minutes',
            key: "10",
            icon: "hourglass half"
        }
        let defaultOpponent = {
            text: "Player",
            key: "player",
            icon: "user"
        }

        let e;
        this.onModeChoice(e, { name: defaultMode });
        this.onTimeChoice(e, { name: defaultTime });
        this.onPlayerChoice(e, { name: defaultOpponent });
    }
    componentDidUpdate(prevProps: Props) {
        if (this.props !== prevProps) {
            if (this.props.gameState === "ongoing") {
                this.setState({ submitted: false })
            }
        }
    }
    onModeChoice = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps) => {
        if (data.name.key === "regular") {
            this.setState({ mode: data.name.key, modeText: data.name.text, modeIcon: data.name.icon })
        }
    }
    onTimeChoice = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps) => {
        if (data.name.key === "5") {
            this.setState({
                time: data.name.key,
                timeText: "5 Minutes",
                timeIcon: data.name.icon
            })
        } else if (data.name.key === "10") {
            this.setState({
                time: data.name.key,
                timeText: "10 Minutes",
                timeIcon: data.name.icon
            })
        } else if (data.name.key === "15") {
            this.setState({
                time: data.name.key,
                timeText: "15 Minutes",
                timeIcon: data.name.icon
            })
        }
    }
    onPlayerChoice = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: DropdownItemProps) => {
        if (data.name.key === "player") {
            this.setState({
                opponentType: data.name.key,
                opponentTypeText: "Player",
                opponentIcon: data.name.icon
            })
        } else if (data.name.key === "comp") {
            this.setState({
                opponentType: data.name.key,
                opponentTypeText: "Computer",
                opponentIcon: data.name.icon
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
                                <Icon size={"large"} />
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
                                <Icon size={"large"} />
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
                                <Icon size={"large"} />
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>

                </Dropdown>
                <Message info hidden={!this.state.errorState}> You have unselected options</Message>
                <Divider></Divider>
                <Button loading={this.state.submitted} className="SubmitButton" onClick={this.sendMatchmakingRequest} type="submit" color="orange">Play</Button>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        gameState:"to be implemented"
    }
}

const mapDispatchToProps = { 
    startMatchmaking: () => { } }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Matchmaking)