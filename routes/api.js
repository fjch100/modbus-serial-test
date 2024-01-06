var express = require("express");
var modbusRouter = require("./modbus");

var app = express();

app.use("/modbus/", modbusRouter);

module.exports = app;