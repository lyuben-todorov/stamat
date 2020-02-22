import * as React from 'react'
import { Grid, Segment, Icon } from 'semantic-ui-react'
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

interface Props {
    message: {
        piece: string;
        to: string;
        flags: string;
    }
    index: number;
    type: string;
    className: string;
}
interface State {
    icon: string;
    to?: string;
    flags?: string;

}
export default class Move extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        switch (this.props.message.piece) {
            case "p":
                this.state = { icon: "chess pawn", to: this.props.message.to }
                break;
            case "b":
                this.state = { icon: "chess bishop", to: this.props.message.to }
                break;
            case "q":
                this.state = { icon: "chess queen", to: this.props.message.to }
                break;
            case "r":
                this.state = { icon: "chess rook", to: this.props.message.to }
                break;
            case "n":
                this.state = { icon: "chess knight", to: this.props.message.to }
                break;
            case "k":
                if (this.props.message.flags === "k") {

                    this.state = { icon: "chess king", flags: "O-O" }
                } else if (this.props.message.flags === "q") {
                    this.state = { icon: "chess king", flags: "O-O-O" }
                } else {
                    this.state = { icon: "chess king", to: this.props.message.to }
                }
                break;
            default:
                break;
        }
    }
    render() {
        return (

            <Segment className={this.props.index % 2 === 0 ? "Move" : "Move Black"}>
                <Grid >
                    {this.props.index % 2 === 0 ? <Grid.Column className="MoveNumber" width={4}>{this.props.index / 2 + 1}</Grid.Column> : <div />}
                    <Grid.Column width={this.props.index % 2 === 0 ? 12 : 16}>


                        <div>
                            <Icon name={this.state.icon as SemanticICONS} />
                            {this.state.flags}{this.state.to}</div>
                    </Grid.Column>
                </Grid>
            </Segment>
        )
    }
}
