const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const connection = require("mysql/lib/Connection");
const { process_params } = require("express/lib/router");
const { promises } = require("stream");
const { resolve } = require("path");
const app = express();
const KEY = "QSC@eDV!BgRt&uJmn HgT6YU89*&9)MNjk,NNJk7JI&7*9KL>():";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "KUSAI",
  password: "KUSAI",
  database: "urlib",
});

exports.getGenres = async () => {
  console.log("model");
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query("SELECT DISTINCT genre from book", (err, rows) => {
        if (!err) {
          console.log(rows);
          resolve(rows);
        } else {
          console.log(err);
          reject(err);
        }
      });
    });

    return response;
  } catch (err) {
    console.log(err);
  }
};
