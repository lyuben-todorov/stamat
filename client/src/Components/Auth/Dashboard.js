import React, { Component } from 'react'
import axios from 'axios';
import { serverUrl, endpoint } from '../../processVariables'

export default class Dashboard extends Component {
    componentDidMount() {
        axios.get(`${serverUrl}${endpoint}/checkToken`, { withCredentials: true }).then((value) => {
        })
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}
