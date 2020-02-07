import * as React from "react";
import * as ReactDOM from "react-dom";
import './sass/index.scss'

import App from "./components/App";
import { Provider } from "react-redux";
import RootStore from "./redux/rootReducer";

export interface processVariables {
    serverUrl: String
    mode: String
    endpoint: String
}

ReactDOM.render(
    <Provider store={RootStore}>
        <App />
    </Provider>
    ,

    document.getElementById("root")
);