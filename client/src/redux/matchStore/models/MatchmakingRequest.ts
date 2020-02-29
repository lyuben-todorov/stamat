import { GameTypes } from "../../GameTypes";
import { GameTime } from "../../GameTime";

export default interface MatchmakingRequest {
    opponentType: "USER" | "GUEST";
    mode: GameTypes
    time: GameTime
    username: string
    sessionId: string,
    autoAccept: boolean
}