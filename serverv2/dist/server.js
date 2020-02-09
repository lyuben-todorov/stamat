"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const env_1 = __importDefault(require("./env"));
const app_1 = __importDefault(require("./app"));
const createLogger_1 = __importDefault(require("./createLogger"));
const PORT = env_1.default.PORT || 5000;
const serverLogger = createLogger_1.default("Server");
const server = http_1.default.createServer(app_1.default);
const io = socket_io_1.default(server, { path: env_1.default.PATH });
server.on("close", () => {
    serverLogger.warn(`Server Closed`);
});
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`); });
//# sourceMappingURL=server.js.map