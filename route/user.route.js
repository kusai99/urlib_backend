const router = require("express").Router();
const userController = require("../controller/user.controller");
const express = require("express");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/delete/:id", userController.deleteUser);

router.post("/signup", express.urlencoded(), userController.createUser);
router.post("/login", express.urlencoded(), userController.login);
router.post("/reg-admin", express.urlencoded(), userController.createAdmin);
router.post("/login-admin", express.urlencoded(), userController.loginAdmin);

module.exports = router;
