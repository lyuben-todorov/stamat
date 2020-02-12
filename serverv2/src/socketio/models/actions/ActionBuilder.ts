import SocketAction from "./SocketAction";
import { ActionPayload } from "./ActionPayload";

export default class ActionBuilder {
    private type: string;
    private payload: ActionPayload

    constructor() { }
    setType(type: string) {
        this.type = type;
        return this;
    }
    setPayload(payload: ActionPayload) {
        this.payload = payload
        return this;
    }
    build(): SocketAction {
        return { type: this.type, payload: this.payload }
    }

}