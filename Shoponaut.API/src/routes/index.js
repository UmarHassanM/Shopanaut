const express = require("express");


const router = express.Router();
const catalogSearch = require("./search");
const autoComplete = require("./autocomplete");

router.get("/search", catalogSearch);
router.post("/search",  catalogSearch);
router.get("/typeahead", autoComplete);
module.exports = router;
