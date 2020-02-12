import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../redux/rootReducer'
interface HomeProps {

}
interface HomeState {

}

export class Home extends React.Component<HomeProps, HomeState> {
    state = {}

    render() {
        return (
            <div>
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
