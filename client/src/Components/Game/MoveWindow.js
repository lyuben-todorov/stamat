import React, { Component } from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Move from './MessageWindow/Move'
import { observer } from 'mobx-react'
@observer
class MoveWindow extends Component {
    render() {
        return (

            <Grid className="MoveWindow">

                <Segment className="PlayerBox">
                    <Icon name={"circle"} color={"green"}></Icon>
                    {this.props.opponentName ? this.props.opponentName: "None"}
                </Segment>

                <Segment className="MoveBox">
                    <Grid className="MoveGrid" columns={2}>
                            {this.props.history.map((message, index) => (
                                <Move className="Move" onMessageAction={this.onMessageAction} type={"history"} index={index} key={index} message={message}></Move>
                            ))}
                    </Grid>
                </Segment>

                <Segment className="PlayerBox">
                    <Icon name={"circle"} color={"green"}></Icon>
                    {this.props.sessionStore.username}

                </Segment>
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

