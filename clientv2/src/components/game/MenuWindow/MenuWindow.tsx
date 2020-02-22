import * as React from 'react'
import { Segment, Menu, MenuItemProps } from 'semantic-ui-react'
import { MenuRouter } from './MenuRouter/MenuRouter'
import { connect } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
interface MenuProps{
    gameState:string;
}
interface MenuState{
    activeItem:string;

}

class MenuWindow extends React.Component<MenuProps, MenuState> {
    constructor(props: MenuProps) {
        super(props);
        switch (this.props.gameState) {
            case "ongoing":
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
    componentDidUpdate(prevProps: MenuProps) {
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
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement,MouseEvent>, 
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
    // to be implemented
    gameState:"default"
})
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MenuWindow)
