// stolen from https://github.com/ornicar/chessground-examples/blob/master/src/util.ts
export default function toDests(chess: any) {
    const dests: any = {};
    chess.SQUARES.forEach((s: any) => {
        const ms = chess.moves({ square: s, verbose: true });
        if (ms.length) dests[s] = ms.map((m: any) => m.to);
    });
    return dests;
}