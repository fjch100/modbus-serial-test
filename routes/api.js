var express = require("express");
var modbusRouter = require("./modbus");
// var authRouter = require("./auth");
// var bookRouter = require("./book");

var app = express();

app.use("/modbus/", modbusRouter);
// app.use("/auth/", authRouter);
// app.use("/book/", bookRouter);

module.exports = app;