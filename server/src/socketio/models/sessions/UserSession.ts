export interface UserSession {
    sessionId: string

    username: string

    email: string

    inMatch: boolean

    connected: boolean

    matchIds: string[]

    activeGameId: string | null;

    activeGameOpponentId: string | null;

    //session settings, matchmaker settings
    autoAccept: boolean

}