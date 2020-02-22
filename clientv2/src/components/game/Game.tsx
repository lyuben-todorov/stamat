import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../redux/rootReducer'
import { Grid } from 'semantic-ui-react'
import MenuWindow from './MenuWindow/MenuWindow'
import MoveWindow from './MoveWindow/MoveWindow'
import { MatchSession } from '../../redux/matchStore/models/MatchSession'
import ChessGame from './ChessGame/ChessGame'
import "../../sass/game.scss"
interface GameProps {
    gameId: string;
    game: MatchSession
}
interface GameState {

}

class Game extends React.Component<GameProps, GameState> {

    render() {
        return (
            <Grid stackable divided="vertically">
                <Grid.Row columns={3}>
                    <Grid.Column className="flexbox" width={4}>
                        <MenuWindow />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <ChessGame/> 
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
    gameId: state.match.activeMatch,
    game: state.match.matches[state.match.activeMatch]
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
