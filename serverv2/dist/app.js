"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const redisClient_1 = __importDefault(require("./redis/redisClient"));
const mongoClient_1 = __importDefault(require("./mongo/mongoClient"));
const index_1 = __importDefault(require("./routes/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const statsistics_1 = __importDefault(require("./routes/statsistics"));
const app = express_1.default();
mongoClient_1.default.startSession();
//middleware
app.use(cors_1.default({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(morgan_1.default('dev'));
// Routes
app.use('/', index_1.default);
app.use('/auth', auth_1.default);
app.use('/statistics', statsistics_1.default);
redisClient_1.default.set("mmqueue", 0);
redisClient_1.default.del("matchmaking_queue");
exports.default = app;
//# sourceMappingURL=app.js.map