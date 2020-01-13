import React, { Component } from 'react'
import axios from 'axios';
import {serverUrl} from '../../processVariables'

export default class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {kur:'no'};
    }

    componentDidMount(){
        axios.get(`${serverUrl}/checkToken`, {withCredentials:true}).then((value)=>{
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
