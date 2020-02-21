import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import { Grid } from 'semantic-ui-react'
import MenuWindow from './MenuWindow/MenuWindow'
import MoveWindow from './MoveWindow/MoveWindow'

interface GameProps {

}
interface GameState {

}

export class Game extends React.Component<GameProps, GameState> {
    state = {}

    render() {
        return (
            <Grid stackable divided="vertically">
                <Grid.Row columns={3}>
                    <Grid.Column className="flexbox" width={4}>
                        <MenuWindow />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        da {/* <ChessGame className="MainChessboard" /> */}
                    </Grid.Column>
                    <Grid.Column className="flexbox" width={4}>
                        <MoveWindow />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = (state: RootState) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
