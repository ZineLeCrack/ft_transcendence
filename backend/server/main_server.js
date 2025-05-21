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
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var child_process_1 = require("child_process");
var https_1 = require("https");
var fs_1 = require("fs");
var net_1 = require("net");
var privateKey = fs_1["default"].readFileSync('/certs/transcend.key', 'utf8');
var certificate = fs_1["default"].readFileSync('/certs/transcend.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = (0, express_1["default"])();
var baseGamePort = 3000;
var nextPort = baseGamePort;
https_1["default"].createServer(credentials, app).listen(4000, '0.0.0.0', function () {
    console.log('🔐 HTTPS Master server running at https://10.12.200.87:4000');
});
app.use((0, cors_1["default"])());
app.use(express_1["default"].json());
app.post('/start', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var port, child;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                port = baseGamePort;
                _a.label = 1;
            case 1: return [4 /*yield*/, isPortFree(port)];
            case 2:
                if (!!(_a.sent())) return [3 /*break*/, 3];
                port++;
                return [3 /*break*/, 1];
            case 3:
                if (port > 3050) {
                    console.log("Cannot start game server, all ports are used");
                    return [2 /*return*/];
                }
                child = (0, child_process_1.spawn)('node', ['server/server.js', port.toString()], {
                    stdio: 'inherit'
                });
                console.log("\uD83C\uDFAE Game server starting on port ".concat(port));
                res.json({ url: "https://10.12.200.87:".concat(port) });
                return [2 /*return*/];
        }
    });
}); });
function isPortFree(port) {
    return new Promise(function (resolve) {
        var tester = net_1["default"].createServer()
            .once('error', function () { return resolve(false); })
            .once('listening', function () {
            tester.close();
            resolve(true);
        })
            .listen(port);
    });
}
// app.listen(4000, () =>
// {
// 	console.log('🌐 Master server running on https://10.12.200.65:4000');
// });
