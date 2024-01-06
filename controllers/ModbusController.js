/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const ModbusRTU = require("modbus-serial");
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
const mbsTimeout = 500;
client.setID(mbsId);
client.setTimeout(mbsTimeout);

let mbsState = MBS_STATE_INIT;
let coils;


// Upon SerialPort error
client.on("error", function (error) {
    console.log("SerialPort ON Error: ", error);
});


//******************************************** */
/**
 * test controller function.
 * 
 * @returns {Object}
 */
exports.open = async (req, res) => {

    try {
        if (!client.isOpen) {
            client.connectRTUBuffered("COM8", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 }, read);
            mbsStatus = "Connected, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
        } else {
            mbsStatus = "CLient already Opened, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
            read();
        }

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
    }

    function read() {
        console.log("entro a leer coils");
        client.setTimeout(mbsTimeout);

        client.readCoils(0, 4)
            .then((data) => {
                console.log("data:", data);
                return apiResponse.successResponseWithData(res, "COILS READ OK", data);
            })
            .catch((error) => {
                console.log("Error leyendo los Coils:", error);
                apiResponse.ErrorResponse(res, "ERROR, FAIL READ COILS");
            });
    }
};
