import React, { Component } from 'react'
import axios from 'axios';

export default class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {kur:'no'};
    }

    componentDidMount(){
        axios.get("http://localhost:3001/checkToken", {withCredentials:true}).then((value)=>{
            console.log(value);
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
