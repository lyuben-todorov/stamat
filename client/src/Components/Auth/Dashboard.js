import React, { Component } from 'react'
import axios from 'axios';
import { serverUrl } from '../../processVariables'

export default class Dashboard extends Component {
    componentDidMount() {
        axios.get(`${serverUrl}/checkToken`, { withCredentials: true }).then((value) => {
        })
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}
