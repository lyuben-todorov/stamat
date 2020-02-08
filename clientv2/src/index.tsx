import * as React from "react";
import * as ReactDOM from "react-dom";
import './sass/index.scss'

import App from "./components/App";
import { Provider } from "react-redux";
import RootStore from "./redux/rootReducer";
import { BrowserRouter } from "react-router-dom";

export interface processVariables {
    serverUrl: String
    mode: String
    endpoint: String
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={RootStore}>
            <App />
        </Provider>
    </BrowserRouter>
    ,

    document.getElementById("root")
);