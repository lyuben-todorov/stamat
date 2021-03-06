import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../redux/rootReducer'
import { testConnection } from '../redux/sessionStore/sessionActions'
import { Button } from 'semantic-ui-react'
import UserSession from '../redux/sessionStore/models/UserSession'
import { SessionState } from '../redux/sessionStore/sessionReducer'
interface HomeProps {
    session: SessionState
    testConnection: Function
}
interface HomeState {

}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <div>
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
