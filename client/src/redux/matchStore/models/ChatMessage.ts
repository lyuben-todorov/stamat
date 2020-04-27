import { ChatMessageChannels, ChatMessageTypes } from "../../../components/game/MenuWindow/MenuRouter/MessageBox/MessageBox";

export default interface ChatMessage {
    sender: string,
    channel: ChatMessageChannels,
    type: ChatMessageTypes
    message: string

}