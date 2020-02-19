import Action from "../socketio/models/actions/Action";

export default function serializeRedisMessage({ type, payload }: Action): string {
    return JSON.stringify({ type: type, payload: payload })
}