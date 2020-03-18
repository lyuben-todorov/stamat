export default interface UserSession {
    sessionId: string
    username: string
    email: string
    inMatch: boolean
    connected: boolean
    matchIds: string[]
    //session settings, matchmaker settings
    autoAccept: boolean

}