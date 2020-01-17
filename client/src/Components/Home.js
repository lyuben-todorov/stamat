import React, { Component } from 'react'
import axios from 'axios'
import { serverUrl, endpoint } from '../processVariables'
import GamePreview from './Dashboard/GamePreview';
import { Divider, Container } from 'semantic-ui-react';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { games: [] };
    }
    componentDidMount() {
        axios.get(`${serverUrl}${endpoint}/statistics/gamesInfo`).then((res) => {
            this.setState({ games: res.data.slice(0, 5) });
        })
    }
    render() {
        return (
            <div className="Home">
                
                <Container>
                    Last 5 games:
                </Container>
                    <Divider />
                    {this.state.games.map((game, index) => (
                        <GamePreview game={game} key={index}></GamePreview>
                    ))}
            </div>
        )
    }
}

export default Home
