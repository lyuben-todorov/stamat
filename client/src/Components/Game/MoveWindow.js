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
                    {this.props.sessionStore.opponentName ? this.props.sessionStore.opponentName : "None"}
                </Segment>

                <Segment className="MoveBox">
                    <Grid className="MoveGrid" columns={2}>
                        <Grid.Row>
                            {this.props.history.map((message, index) => (
                                <Move className="Move" onMessageAction={this.onMessageAction} type={"history"} key={index} message={message}></Move>
                            ))}
                        </Grid.Row>
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
        game: state.game,
        history: state.history
    }
}
const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MoveWindow)

