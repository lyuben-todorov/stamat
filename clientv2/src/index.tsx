import * as React from "react";
import * as ReactDOM from "react-dom";
import './sass/index.scss'

import { App } from "./components/App";

ReactDOM.render(
    <App loggedIn={true}/>,
    document.getElementById("root")
);