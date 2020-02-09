"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAuth_1 = __importDefault(require("../middleware/withAuth"));
var router = express_1.default.Router();
router.get('/checkToken', withAuth_1.default, function (req, res) {
    res.status(200).send("yeees");
});
exports.default = router;
//# sourceMappingURL=index.js.map