import React, { Component } from 'react'
import { Segment, Grid, Icon, Menu, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Move from './MessageWindow/Move'
import { observer } from 'mobx-react'
import Timer from 'react-compound-timer';
@observer
class MoveWindow extends Component {
    render() {
        return (

            <Grid className="MoveWindow">

                <div className="Timer">
                    <Timer timeToUpdate={1000} initialTime={60000 * 5} direction={"backward"} >
                        <div className="TimerNumber">
                            <Timer.Minutes />
                        </div>:
                        <div className="TimerNumber Seconds">
                            <Timer.Seconds />
                        </div>


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
                            <Button color={"red"} onClick={() => { console.log("asd") }}>
                                <Icon size={"large"} name={"flag outline"}></Icon>
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button onClick={() => { console.log("asd") }}>
                                <Icon size={"large"} name={"handshake outline"}></Icon>
                            </Button>
                        </Menu.Item>
                    </Menu>
                </Segment>
                <div className="Timer">
                    <Timer timeToUpdate={1000} initialTime={60000 * 5} direction={"backward"} >
                        <div className="TimerNumber">
                            <Timer.Minutes />
                        </div>:
                        <div className="TimerNumber Seconds">
                            <Timer.Seconds />
                        </div>


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
        history: state.history
    }
}
const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MoveWindow)

