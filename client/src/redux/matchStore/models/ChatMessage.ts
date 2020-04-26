import { ChatMessageChannels } from "../../../components/game/MenuWindow/MenuRouter/MessageBox/MessageBox";

export default interface ChatMessage {
    channel: ChatMessageChannels,
    message: string

}