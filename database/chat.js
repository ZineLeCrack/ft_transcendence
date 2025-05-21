"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var https_1 = require("https");
var privateKey = fs_1.default.readFileSync('/certs/transcend.key', 'utf8');
var certificate = fs_1.default.readFileSync('/certs/transcend.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = (0, express_1.default)();
var dbPath = './user.db';
https_1.default.createServer(credentials, app).listen(3452, '0.0.0.0', function () {
    console.log('HTTPS database server running at https://10.12.200.87:3452');
});
