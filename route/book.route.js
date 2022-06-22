const router = require("express").Router();
const bookController = require("../controller/book.controller");
const express = require("express");

router.get("/genres", express.urlencoded(), bookController.getGenres);

module.exports = router;
