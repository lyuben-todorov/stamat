import * as React from "react";
import * as ReactDOM from "react-dom";
import './sass/index.scss'

import App from "./components/App";

export interface processVariables {
    serverUrl: String
    mode: String
    endpoint: String
}

ReactDOM.render(
    <App loggedIn={true} />,
    document.getElementById("root")
);