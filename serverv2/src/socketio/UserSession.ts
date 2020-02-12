export interface UserSession{
    sessionId:string
    username:string
    email:string
    inMatch:boolean
    connected:boolean
    matchId:string
    //session settings, matchmaker settings
    autoAccept:boolean

}