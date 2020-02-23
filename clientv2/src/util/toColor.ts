// stolen from https://github.com/ornicar/chessground-examples/blob/master/src/util.ts
export default function toColor(chess: any) {
    return (chess.turn() === 'w') ? 'white' : 'black';
}