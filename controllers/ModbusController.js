/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

// Modbus configuration values
// const mbsId = 0;
client.setID(0);
const mbsScan = 100;
const mbsTimeout = 300;
client.setTimeout(mbsTimeout);

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
    let portRetrys = 0;
    let readRetrys = 0;
    let maxRetrys = 3;
    try {
        if (!client.isOpen) {
            let comOpen = await openCom('COM8');
            if (!comOpen) {
                while (!comOpen) {
                    console.log("Opening port retry# ", portRetrys);
                    comOpen = await openCom('COM8');
                    portRetrys++;
                    if (portRetrys > maxRetrys) {
                        // return apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
                        throw new Error("COULD NOT OPEN COM PORT");
                    }
                }
            }
            // return apiResponse.successResponseWithData(res, "Port Open OK", []);
        }


        let read = await readingCoils();
        if (!read) {
            while (!read) {
                console.log("Reading Coils retry# ", readRetrys);
                read = await readingCoils();
                readRetrys++;
                if (readRetrys > maxRetrys) {
                    console.log("Error leyendo los Coils:");
                    // apiResponse.ErrorResponse(res, "ERROR, FAIL READ COILS");
                    throw new Error("ERROR, FAIL READ COILS");
                }
            }
        }
        return apiResponse.successResponseWithData(res, "COILS READ OK", read);

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO READ COILS: " + error);
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
    let portRetrys = 0;
    let readRetrys = 0;
    let maxRetrys = 3;
    try {
        if (!client.isOpen) {
            let comOpen = await openCom('COM8');
            if (!comOpen) {
                while (!comOpen) {
                    console.log("Opening port retry# ", portRetrys);
                    comOpen = await openCom('COM8');
                    portRetrys++;
                    if (portRetrys > maxRetrys) {
                        // return apiResponse.ErrorResponse(res, "ERROR, FAIL TO OPEN PORT");
                        throw new Error("COULD NOT OPEN COM PORT");
                    }
                }
            }
            // return apiResponse.successResponseWithData(res, "Port Open OK", []);
        }


        let read = await readingInputs();
        if (!read) {
            while (!read) {
                console.log("Reading Inputs retry# ", readRetrys);
                read = await readingInputs();
                readRetrys++;
                if (readRetrys > maxRetrys) {
                    console.log("Error leyendo las Inputs:");
                    // apiResponse.ErrorResponse(res, "ERROR, FAIL READ Inputs");
                    throw new Error("ERROR, FAIL READ Inputs");
                }
            }
        }
        return apiResponse.successResponseWithData(res, "INPUTS READ OK", read);

    } catch (error) {
        console.log("Error opening the COM port:", error);
        apiResponse.ErrorResponse(res, "ERROR, FAIL TO READ COILS: " + error);
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

            console.log("Status connectRTUBuffered: ", "Connected, wait for reading...");
        } else {

            console.log("Status connectRTUBuffered: ", "CLient already Opened, wait for reading...");
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

const readingCoils = async () => {
    console.log("entro a leer coils");
    client.setTimeout(mbsTimeout);
    try {
        let data = await client.readCoils(0, 4);
        const CoilsData = data.data;
        console.log("CoilsData:", CoilsData);
        return CoilsData;
    } catch (error) {
        console.log("Error leyendo los Coils:", error);
        return false;
    }

};


const readingInputs = async () => {
    console.log("entro a leer Inputs");
    client.setTimeout(mbsTimeout);
    try {
        let data = await client.readDiscreteInputs(0, 5);
        const CoilsData = data.data;
        console.log("InputsData:", CoilsData);
        return CoilsData;
    } catch (error) {
        console.log("Error leyendo las Inputs:", error);
        return false;
    }

};


const openCom = async (port) => {
    if (!client.isOpen) {
        console.log("Opening " + port + " Port");
        try {
            await client.connectRTUBuffered(port, { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 });
            console.log("COM8 port Open, waiting for Read");
            return true;
        } catch (error) {
            console.log("ERROR OPENING THE COM PORT: ", error);
            return false;
        }
    } else {
        console.log("COM8 port already Opened, waiting for Read");
        return true;
    }
};


// if (!client.isOpen) {
//     console.log("COM port NOT OPEN, WILL OPEN ");
//     client.connectRTUBuffered("COM8", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 }, readC);
//     // mbsStatus = "Connected, wait for reading...";
//     // console.log("Status connectRTUBuffered: ", mbsStatus);
//     // readC();
// } else {
//     mbsStatus = "CLient already Opened, wait for reading...";
//     console.log("Status connectRTUBuffered: ", mbsStatus);
//     readC();
// }



// function readC() {
//     console.log("entro a leer coils");
//     client.setTimeout(mbsTimeout);
//     // retrys++;
//     client.readCoils(0, 4)
//         .then((data) => {
//             const CoilsData = data.data;
//             console.log("CoilsData:", CoilsData);
//             return apiResponse.successResponseWithData(res, "COILS READ OK", CoilsData);
//         })
//         .catch((error) => {
//             console.log("Error leyendo los Coils:", error);
//             apiResponse.ErrorResponse(res, "ERROR, FAIL READ COILS");
//         });
// }

