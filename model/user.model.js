const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
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

exports.getUsers = async () => {
  console.log("model");
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query("SELECT * from user", (err, rows) => {
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

exports.getUser = async (id) => {
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM user WHERE id = ?", [id], (err, rows) => {
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

exports.createUser = async (user) => {
  var rowCount = 0;
  console.log(user.fname);
  var password = crypto
    .createHash("sha256")
    .update(user.pw)
    .digest("hex")
    .substring(0, 31);
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM user WHERE user_id = ?",
        [user.user_id],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else if (rows.length != 0) {
            pool.query(
              "SELECT reg FROM User WHERE user_id = ?",
              [user.user_id],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else if (rows[0].reg === 1) {
                  console.error("can't create user " + user.user_id);
                  resolve("This user is already registered! " + user.user_id);
                } else {
                  // console.log("Can create user " + user.name);
                  pool.query(
                    "UPDATE User SET reg = 1, fname = ?, lname = ?, pw = ? WHERE user_id = ?",
                    [user.fname, user.lname, password, user.user_id],
                    (err, rows) => {
                      if (err) reject(new Error(err.message));
                      else
                        resolve(
                          "Student has been registered to the system, id: " +
                            user.user_id
                        );
                      // pool.query(
                      //   "SELECT id FROM User WHERE user_id = ?",
                      //   [user.user_id],
                      //   (err, rows) => {
                      //     if (err) reject(new Error(err.message));
                      //     else {
                      //       var newUserID = rows[0].id;
                      //       pool.query(
                      //         "INSERT INTO Student (id) VALUES (?)",
                      //         [newUserID],
                      //         (err) => {
                      //           if (err) reject(new Error(err.message));
                      //           resolve("Student user created");
                      //         }
                      //       );
                      //     }
                      //   }
                      // );
                    }
                  );
                }
              }
            );
            // console.error("can't create user " + user.user_id);
            // resolve("A user with that matric/staff number already exists");
          } else {
            console.log("user not registered, name: " + user.fname);
            resolve("Student not found in the system.");
            // console.log("Can create user " + user.name);
            // pool.query(
            //   "INSERT INTO user(user_id, fname, lname, pw) VALUES (?, ?, ?, ?)",
            //   [user.user_id, user.fname, user.lname, password],
            //   (err, rows) => {
            //     if (err) reject(new Error(err.message));
            //     pool.query(
            //       "SELECT id FROM User WHERE user_id = ?",
            //       [user.user_id],
            //       (err, rows) => {
            //         if (err) reject(new Error(err.message));
            //         else {
            //           var newUserID = rows[0].id;
            //           pool.query(
            //             "INSERT INTO Student (id) VALUES (?)",
            //             [newUserID],
            //             (err) => {
            //               if (err) reject(new Error(err.message));
            //               resolve("Student user created");
            //             }
            //           );
            //         }
            //       }
            //     );
            //   }
            // );
          }

          console.log("The data from users table are: \n", rows);
          if (rows == undefined) rowCount = 0;
          else rowCount = rows.length;
        }
      );
    });
    return [response, rowCount];
  } catch (err) {
    console.log(err);
  }
};

exports.deleteUser = async (id) => {
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query(`DELETE FROM Student WHERE id = ?`, [id], (err, rows) => {
        if (err) reject(new Error(err.message));
        resolve(rows);
        pool.query(`DELETE FROM User WHERE id = ?;`, [id], (err, rows) => {
          if (err) reject(new Error(err.message));
          resolve(rows);
        });
      });
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (info) => {
  console.log("user_id and pw");
  console.log(info.user_id, info.pw);
  var password = crypto
    .createHash("sha256")
    .update(info.pw)
    .digest("hex")
    .substring(0, 31);
  console.log(password);
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM user WHERE user_id = ? AND pw = ?",
        [info.user_id, password],
        // "select pw from users where name = ?",
        // [info.name],
        (err, row) => {
          if (err) {
            console.log(err);
            reject(new err(err.message));
          } else if (row.length != 0) {
            // console.log(row);
            var string = JSON.stringify(row);
            var jsonString = JSON.parse(string);
            user_id_json = jsonString[0].id;
            console.log(row);

            var payload = {
              name: info.name,
            };

            var token = jwt.sign(payload, KEY, {
              algorithm: "HS256",
              expiresIn: "1m",
            });
            console.log(` exp ${token.expiresIn}`);
            console.log("Success");
            resolve(JSON.parse(`{"token":"${token}","id": ${user_id_json}}`));
          } else {
            console.error("Failure");
            // res.status(401);
            resolve(err);
          }
        }
      );
    });
    console.log("response", response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

exports.createAdmin = async (admin) => {
  var rowCount = 0;
  console.log(admin);
  var password = crypto.createHash("sha256").update(admin.pw).digest("hex");

  try {
    const response = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Librarian WHERE staff_id = ?",
        [admin.staff_id],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else if (rows.length == 0) {
            pool.query(
              "INSERT INTO Librarian(staff_id, fname, lname, pw) VALUES (?, ?, ?, ?)",
              [admin.staff_id, admin.fname, admin.lname, password],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve("Librarian has been created!");
                }
              }
            );
          } else {
            console.log(
              "Librarian is already in the system, name: " + admin.lname
            );
            resolve("Librarian already registered.");
          }

          console.log("The data from users table are: \n", rows);
          if (rows == undefined) rowCount = 0;
          else rowCount = rows.length;
        }
      );
    });
    return [response, rowCount];
  } catch (err) {
    console.log(err);
  }
};

exports.loginAdmin = async (info) => {
  console.log("staff_id and pw");
  console.log(info.staff_id, info.pw);
  var password = crypto.createHash("sha256").update(info.pw).digest("hex");
  console.log(password);
  try {
    const response = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Librarian WHERE staff_id = ? AND pw = ?",
        [info.staff_id, password],

        (err, row) => {
          console.log(`row length${row.length}`);
          if (err) {
            console.log(err);
            reject(new err(err.message));
          } else if (row.length != 0) {
            var string = JSON.stringify(row);
            var jsonString = JSON.parse(string);
            staff_id_json = jsonString[0].id;
            console.log(row);

            var payload = {
              name: info.name,
            };

            var token = jwt.sign(payload, KEY, {
              algorithm: "HS256",
              expiresIn: "1m",
            });
            console.log(` exp ${token.expiresIn}`);
            console.log("Success");
            resolve(JSON.parse(`{"token":"${token}","id": ${staff_id_json}}`));
          } else {
            console.error("Failure");
            resolve(err);
          }
        }
      );
    });
    console.log("response", response);
    return response;
  } catch (err) {
    console.log(err);
  }
};
