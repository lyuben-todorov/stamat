import React, { Component } from 'react'
import { Segment, Menu } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { MenuRouter } from './MenuWindow/MenuRouter'
import { connect } from 'react-redux';

@observer
class MenuWindow extends Component {
    constructor(props) {
        super(props);
        switch (this.props.gameState) {
            case "ongoing" || "initiateGame":
                this.state = { activeItem: "chat" }
                break;
            case "default":
                this.state = { activeItem: "matchmaking" }
                break;
            default:
                break;
        }
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            switch (this.props.gameState) {
                case "ongoing" || "initiateGame":
                    this.setState({ activeItem: "chat" })
                    break;
                case "default":
                    this.setState({ activeItem: "matchmaking" })
                    break;
                default:
                    break;
            }
        }
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return (
            <Segment className="MenuWindow">
                <Segment className="Content">
                    <MenuRouter active={activeItem} />
                </Segment>

                <Menu className="Menu" attached='bottom' tabular>
                    <Menu.Item
                        name='matchmaking'
                        active={activeItem === 'matchmaking'}
                        onClick={this.handleItemClick}>
                        Matchmaking
                        </Menu.Item>

                    <Menu.Item
                        name={"chat"}
                        active={activeItem === 'chat'}
                        onClick={this.handleItemClick}>
                        Chat
                    </Menu.Item>

                    <Menu.Item
                        name='history'
                        active={activeItem === 'history'}
                        onClick={this.handleItemClick}>
                        Game History
                    </Menu.Item>

                </Menu>
            </Segment>
        )
    }
}


const mapStateToProps = (state) => ({
    gameState: state.gameState
})
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MenuWindow)
