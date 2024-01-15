"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var user_1 = __importDefault(require("./handlers/user"));
var products_1 = __importDefault(require("./handlers/products"));
var cart_1 = __importDefault(require("./handlers/cart"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var address = "127.0.0.1:3000";
var path_1 = __importDefault(require("path"));
var corsOptions = {};
var port = 3000;
if (process.env.ENV === 'test') {
    port = 3001;
}
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
(0, user_1.default)(app);
(0, products_1.default)(app);
(0, cart_1.default)(app);
app.listen(port, function () {
    console.info("Express is listening at ".concat(port));
});
exports.default = app;
