/* eslint-disable linebreak-style */

var express = require("express");
const ModbusController = require("../controllers/ModbusController");

var router = express.Router();

router.get("/", ModbusController.test);

/*
router.get("/", BookController.bookList);
router.get("/:id", BookController.bookDetail);
router.post("/", BookController.bookStore);
router.put("/:id", BookController.bookUpdate);
router.delete("/:id", BookController.bookDelete);
*/

module.exports = router;