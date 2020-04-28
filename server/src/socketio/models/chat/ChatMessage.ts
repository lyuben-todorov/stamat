
export type ChatMessageTypes = "gameOver" | "initiateGame" | "resumeGame" | "chat" | "ping";
export type ChatMessageChannels = "currentMatch" | "private" | "global";

export default interface ChatMessage {
    sender: string,
    channel: ChatMessageChannels,
    type: ChatMessageTypes
    message: string

}