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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var fs_1 = require("fs");
var https_1 = require("https");
var sqlite3_1 = require("sqlite3");
var sqlite_1 = require("sqlite");
var privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
var certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = (0, express_1.default)();
var dbPath = './user.db';
https_1.default.createServer(credentials, app).listen(3451, '0.0.0.0', function () {
    console.log('HTTPS database server running at https://10.12.200.87:3451');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/submit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, db, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                if (!username || !email || !password) {
                    res.status(400).send('Incomplete data');
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getDb()];
            case 2:
                db = _b.sent();
                return [4 /*yield*/, db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [username, email, password])];
            case 3:
                _b.sent();
                res.status(200).send('User created');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function getDb() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, sqlite_1.open)({
                    filename: dbPath,
                    driver: sqlite3_1.default.Database,
                })];
        });
    });
}
