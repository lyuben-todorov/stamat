import Action from "./Action";

export default class ActionBuilder {
    private type: string;
    private payload: any

    constructor() { }
    setType(type: string) {
        this.type = type;
        return this;
    }
    setPayload(payload: any) {
        this.payload = payload
        return this;
    }
    build(): Action {
        return { type: this.type, payload: this.payload }
    }

}