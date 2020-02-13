export interface LoginPayload {
    sessionId: string;
    userType: "user";
    username: string;
    inMatch: boolean;

}