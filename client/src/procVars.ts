interface processVariables {
    serverUrl: string
    socketUrl: string
    mode: string
    endpoint: string
}

const procVars: processVariables = {
    serverUrl: "http://localhost:3001",
    socketUrl: "http://localhost:3001",
    mode: "development",
    endpoint: ""
}

export default procVars