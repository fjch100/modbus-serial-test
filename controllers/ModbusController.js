/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */

// const { body, validationResult } = require("express-validator");
// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const ModbusRTU = require("modbus-serial");
// create an empty modbus client
const client = new ModbusRTU();

let mbsStatus = "Initializing...";    // holds a status of Modbus

// Modbus 'state' constants
const MBS_STATE_INIT = "State init";
const MBS_STATE_IDLE = "State idle";
const MBS_STATE_NEXT = "State next";
const MBS_STATE_GOOD_READ = "State good (read)";
const MBS_STATE_FAIL_READ = "State fail (read)";
const MBS_STATE_GOOD_CONNECT = "State good (port)";
const MBS_STATE_FAIL_CONNECT = "State fail (port)";

// Modbus configuration values
const mbsId = 0;
const mbsScan = 100;
const mbsTimeout = 5000;
let mbsState = MBS_STATE_INIT;
let timerScan;
let needReturn = false;
let coils;

// Upon SerialPort error
client.on("error", function (error) {
    console.log("SerialPort ON Error: ", error);
});
/********************************************* */


//==============================================================
const connectClient = async () => {
    let result = false;
    // set requests parameters
    client.setID(mbsId);
    client.setTimeout(mbsTimeout);

    // try to connect
    try {
        await client.connectRTUBuffered("COM7", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 });
        mbsState = MBS_STATE_GOOD_CONNECT;
        mbsStatus = "Connected, wait for reading...";
        console.log("Status connectRTUBuffered: ", mbsStatus);
        result = true;
    } catch (error) {
        mbsState = MBS_STATE_FAIL_CONNECT;
        mbsStatus = error.message;
        console.log("ERROR IN connectRTUBuffered: ", error);
        result = false;
    }
    return result;
};


//==============================================================
const readModbusData = async () => {
    let result = false;

    // try to read data
    try {
        coils = await client.readCoils(0, 4);
        mbsState = MBS_STATE_GOOD_READ;
        mbsStatus = "success";
        console.log(coils);
        needReturn = true;
        result = true;
    } catch (error) {
        mbsState = MBS_STATE_FAIL_READ;
        mbsStatus = error.message;
        console.log("readModBusData Error: ", error);
        result = false;
    }
    return result;
};
//********************************************************** */

const disconnectModBus = () => {
    clearTimeout(timerScan);
    if (client.isOpen) {
        client.close();
    }
};

//==============================================================
const runModbus = async () => {
    let nextAction;
    if (needReturn) {
        mbsState = MBS_STATE_INIT;
        return coils;
    }

    switch (mbsState) {
        case MBS_STATE_INIT:
            nextAction = connectClient;
            break;

        case MBS_STATE_NEXT:
            nextAction = readModbusData;
            break;

        case MBS_STATE_GOOD_CONNECT:
            nextAction = readModbusData;
            break;

        case MBS_STATE_FAIL_CONNECT:
            nextAction = connectClient;
            break;

        case MBS_STATE_GOOD_READ:
            needReturn = true;
            nextAction = disconnectModBus;
            break;

        case MBS_STATE_FAIL_READ:
            if (client.isOpen) { mbsState = MBS_STATE_NEXT; }
            else { nextAction = connectClient; }
            break;

        default:
        // nothing to do, keep scanning until actionable case
    }

    console.log("NextAction:", nextAction);

    // execute "next action" function if defined
    if (nextAction !== undefined) {
        await nextAction();
        mbsState = MBS_STATE_IDLE;
    }

    // set for next run
    timerScan = setTimeout(runModbus, mbsScan);
};


//******************************************** */
/**
 * test controller function.
 * 
 * @returns {Object}
 */
exports.test = async (req, res) => {
    let ModbusData;
    mbsState = MBS_STATE_INIT;
    try {
        ModbusData = await runModbus();
        console.log("ModbusData:", ModbusData);
        return apiResponse.successResponseWithData(res, "Operation success", ModbusData);

    } catch (err) {
        //throw error in json response with status 500. 
        console.log("LANZO ERROR:", err);
        return apiResponse.ErrorResponse(res, "ERROR RESPONSE");
    } finally {
        disconnectModBus();
        console.log("END");
    }
};
