import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react'

export default class Move extends Component {
    render() {
        return (

            <Segment className="Move">
                <Grid divided="vertically">
                    <Grid.Column width={14}>
                        <div>{this.props.message.to}</div>
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}
