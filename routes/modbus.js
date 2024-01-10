/* eslint-disable linebreak-style */

var express = require("express");
const ModbusController = require("../controllers/ModbusController");

var router = express.Router();

router.get("/readcoils", ModbusController.readCoils);
router.get("/readinputs", ModbusController.readInputs);
router.post("/writecoils", ModbusController.writeCoils);



/*
router.get("/", BookController.bookList);
router.get("/:id", BookController.bookDetail);
router.post("/", BookController.bookStore);
router.put("/:id", BookController.bookUpdate);
router.delete("/:id", BookController.bookDelete);
*/

module.exports = router;