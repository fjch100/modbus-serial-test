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
 * readCoils controller function.
 * 
 * @returns {Object}
 * {
    "status": 1,
    "message": "COILS READ OK",
    "data": {
        "data": [
            true,
            true,
            false,
            true,
            false,
            false,
            false,
            false
        ],
        "buffer": {
            "type": "Buffer",
            "data": [
                11
            ]
        }
    }
}
 */
exports.readCoils = async (req, res) => {

    try {
        if (!client.isOpen) {
            client.connectRTUBuffered("COM8", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 }, readC);
            mbsStatus = "Connected, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
        } else {
            mbsStatus = "CLient already Opened, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
            readC();
        }

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
    }

    function readC() {
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

//******************************************** */
/**
 * readInputs controller function.
 * 
 * @returns {Object} 
 * {
    "status": 1,
    "message": "INPUTS READ OK",
    "data": {
        "data": [
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false
        ],
        "buffer": {
            "type": "Buffer",
            "data": [
                2
            ]
        }
    }
}
 */
exports.readInputs = async (req, res) => {

    try {
        if (!client.isOpen) {
            client.connectRTUBuffered("COM8", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 }, readI);
            mbsStatus = "Connected, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
        } else {
            mbsStatus = "CLient already Opened, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
            readI();
        }

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
    }

    function readI() {
        console.log("entro a leer inputs");
        client.setTimeout(mbsTimeout);

        client.readDiscreteInputs(0, 5)
            .then((data) => {
                console.log("data:", data);
                return apiResponse.successResponseWithData(res, "INPUTS READ OK", data);
            })
            .catch((error) => {
                console.log("Error leyendo los Coils:", error);
                apiResponse.ErrorResponse(res, "ERROR, FAIL READ INPUTS");
            });
    }
};



//******************************************** */
/**
 * writeInputs controller function.
 * input:{"data":{"coil":"3", "state":"false"}}
 * 
 * @returns {Object}
 * 
 */
exports.writeCoils = async (req, res) => {
    console.log("Data received:", req.body.data);
    let rxData = req.body.data; //{"data":{"coil":"3", "state":"true"}}
    // return apiResponse.successResponseWithData(res, "INPUTS READ OK", [req.body.data]);

    try {
        if (!client.isOpen) {
            client.connectRTUBuffered("COM8", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 }, writeC);
            mbsStatus = "Connected, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
        } else {
            mbsStatus = "CLient already Opened, wait for reading...";
            console.log("Status connectRTUBuffered: ", mbsStatus);
            writeC();
        }

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
    }

    function writeC() {
        console.log("entro a escribir coils");
        client.setTimeout(mbsTimeout);

        /* address {number}: The Data Address of the first register,
           array {array}: The array of states to force into the coils */

        client.writeCoil(rxData.coil, rxData.state)
            .then((data) => {
                console.log("data:", data);
                return apiResponse.successResponseWithData(res, "COILS WRITE OK", data);
            })
            .catch((error) => {
                console.log("Error leyendo los Coils:", error);
                apiResponse.ErrorResponse(res, "ERROR, FAIL WRITE COILS");
            });
    }

};