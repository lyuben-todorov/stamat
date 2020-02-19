import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../redux/rootReducer'
import { testConnection } from '../redux/sessionStore/sessionActions'
import { Button } from 'semantic-ui-react'
import { UserSession } from '../redux/sessionStore/sessionPayloadTypes'
interface HomeProps {
    session: UserSession
    testConnection: Function
}
interface HomeState {

}

export class Home extends React.Component<HomeProps, HomeState> {
    state = {}

    render() {
        return (
            <div>
                Home
                <Button onClick={this.props.testConnection(this.props.session)}></Button>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    session: state.session
})

const mapDispatchToProps = {
    testConnection: testConnection
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
