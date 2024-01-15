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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByUser = void 0;
var SFUser_1 = require("../models/SFUser");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var userStore = new SFUser_1.UserStore();
dotenv_1.default.config();
var SECRET = process.env.TOKEN_KEY;
var getTokenByUser = function (user) {
    return jsonwebtoken_1.default.sign({ user: user }, SECRET);
};
exports.getTokenByUser = getTokenByUser;
var indexUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userStore.indexUser()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); };
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstname, lastname, username, password, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                username = req.body.username;
                password = req.body.password;
                return [4 /*yield*/, userStore.createUser({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        password: password,
                    })];
            case 1:
                user = _a.sent();
                res.json((0, exports.getTokenByUser)(user));
                return [2 /*return*/];
        }
    });
}); };
var readUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, userStore.showUser(id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, firstname, lastname, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                return [4 /*yield*/, userStore.updateUser(id, {
                        firstname: firstname,
                        lastname: lastname,
                    })];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, userStore.deleteUser(id)];
            case 1:
                _a.sent();
                res.send("User with id ".concat(id, " successfully deleted."));
                return [2 /*return*/];
        }
    });
}); };
var authenticate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username || 'ChrissAnne';
                password = req.body.password || 'password123';
                return [4 /*yield*/, userStore.authenticate(username, password)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("Wrong password for user ".concat(username, "."))];
                }
                res.json((0, exports.getTokenByUser)(user));
                return [2 /*return*/];
        }
    });
}); };
var checkToken = function (req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    else {
        return false;
    }
};
function userRoutes(app) {
    app.get('/users', indexUser);
    app.post('/users/create', createUser);
    app.get('/users/:id', readUser);
    app.put('/users/:id', checkToken, update);
    app.delete('/users/:id', checkToken, deleteUser);
    app.post('/users/authenticate', authenticate);
}
exports.default = userRoutes;
