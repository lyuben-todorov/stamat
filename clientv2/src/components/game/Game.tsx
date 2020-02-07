import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../redux/rootReducer'

interface GameProps {

}
interface GameState {

}

export class Game extends React.Component<GameProps, GameState> {
    state = {}

    render() {
        return (
            <div>
                Game
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
