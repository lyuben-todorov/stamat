export default function serializeRedisMessage(type: string, payload: object): string {
    return JSON.stringify({ type: type, payload: payload })
}