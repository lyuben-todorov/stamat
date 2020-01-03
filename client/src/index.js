import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import {Provider} from 'react-redux';
import App from './Components/App';
import * as serviceWorker from './serviceWorker';
import SessionStore from './Mobx/SessionStore';
import gameState from './redux/gameState';

ReactDOM.render(<Provider store={gameState}><App store={SessionStore} /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
