import * as React from 'react'
import Chat from './Chat';
import Matchmaking from './Matchmaking';
interface Props {
    active: string;
}
interface State {

}

export class MenuRouter extends React.Component<Props, State> {

    render() {
        return (
            <div className="MenuRouter">
                {(() => {
                    switch (this.props.active) {
                        case 'matchmaking':
                            return <Matchmaking />
                        case 'chat':
                            return <Chat />
                        case 'history':
                            return ""
                        default:
                            break;
                    }
                })()}
            </div>
        )
    }
}
