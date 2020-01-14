import React, { Component } from 'react'
import { Segment, Menu } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import SessionStore from '../../Mobx/SessionStore'
import { MenuRouter } from './MenuWindow/MenuRouter'

@observer
export default class MenuWindow extends Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: 'matchmaking' }
        this.handleItemClick = this.handleItemClick.bind(this);
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return (
            <Segment className="MenuWindow">
                <Segment className="Content">
                    <MenuRouter active={activeItem}/>
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
