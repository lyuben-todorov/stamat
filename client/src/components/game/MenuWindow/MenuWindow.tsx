import * as React from 'react'
import { Segment, Menu, MenuItemProps } from 'semantic-ui-react'
import { MenuRouter } from './MenuRouter/MenuRouter'
import { connect } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { MatchSession } from '../../../redux/matchStore/models/MatchSession';
import { ClientState } from '../../../redux/clientStateStore/clientStateReducer';

interface MenuProps {
    gameId: string;
    game: MatchSession;
    clientState: ClientState;
}

interface MenuState {
    activeItem: string;

}

class MenuWindow extends React.Component<MenuProps, MenuState> {
    constructor(props: MenuProps) {
        super(props);
        switch (this.props.clientState.gameState) {
            case "ongoing":
                this.state = { activeItem: "chat" }
                break;
            case "default":
            default:
                this.state = { activeItem: "matchmaking" }
                break;
        }
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    componentDidUpdate(prevProps: MenuProps) {
        if (this.props !== prevProps) {
            switch (this.props.clientState.gameState) {
                case "ongoing" || "starting":
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
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        data: MenuItemProps) => this.setState({ activeItem: data.name })

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


const mapStateToProps = (state: RootState) => ({
    gameId: state.match.activeMatch,
    game: state.match.matches[state.match.activeMatch],
    clientState: state.clientState
})
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MenuWindow)
