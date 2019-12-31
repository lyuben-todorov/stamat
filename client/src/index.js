import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'

import App from './Components/App';
import * as serviceWorker from './serviceWorker';
import SessionStore from './Mobx/SessionStore';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(<CookiesProvider><App store={SessionStore} /></CookiesProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
