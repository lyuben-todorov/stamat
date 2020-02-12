export interface LoginPayload {
    sessionId: string;
    userType: "user";
    username: string;
    email: string;
    loggedIn: boolean;
    inMatch: boolean;
}