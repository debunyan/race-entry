"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_service_1 = require("./services/database.service");
const database_service_2 = require("./services/database.service");
const event_api_router_1 = require("./routers/event-api.router");
const event_router_1 = require("./routers/event.router");
const file_api_router_1 = require("./routers/file-api.router");
const file_router_1 = require("./routers/file.router");
const sonsor_api_router_1 = require("./routers/sonsor-api.router");
const spot_api_router_1 = require("./routers/spot-api.router");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set("views", "/app/src/views"); // ejs は TypeScript によってコンパイルされない
// Origin 制約を解除しないとブラウザから直接API呼び出しできない。
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});
app.use('/uploads', file_router_1.fileRouter);
app.use("/api/file", file_api_router_1.fileApiRouter);
const port = process.env.PORT;
const topPageRouter = express_1.default.Router();
topPageRouter.get('/', function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = (yield ((_a = database_service_2.collections.events) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
            res.status(200);
            res.render('index.ejs', { events });
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
(0, database_service_1.connectToDatabase)()
    .then(() => {
    app.use("/", topPageRouter);
    app.use("/event", event_router_1.eventRouter);
    app.use("/api/event", event_api_router_1.eventApiRouter);
    app.use("/api/sensor", sonsor_api_router_1.sensorApiRouter);
    app.use("/api/spot", spot_api_router_1.spotApiRouter);
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});
