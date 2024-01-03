/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */

// const { body, validationResult } = require("express-validator");
// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");


let dataExample = {
    test1: "hola",
    test2: 123
};

/**
 * test controller function.
 * 
 * @returns {Object}
 */
exports.test = (req, res) => {
    try {

        return apiResponse.successResponseWithData(res, "Operation success", dataExample);

    } catch (err) {
        //throw error in json response with status 500. 
        return apiResponse.ErrorResponse(res, err);
    }
};



/**
 * Book List.
 * 
 * @returns {Object}
 */
/*
exports.bookList = [
    auth,
    function (req, res) {
        try {

            return apiResponse.successResponseWithData(res, "Operation success", []);

        } catch (err) {
            //throw error in json response with status 500. 
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
*/