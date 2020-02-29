import Action from "../socketio/models/actions/RedisActionTypes";

export default function serializeRedisMessage({ type, payload }: Action): string {
    return JSON.stringify({ type: type, payload: payload })
}