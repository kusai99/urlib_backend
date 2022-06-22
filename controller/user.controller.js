const userModel = require("../model/user.model");
// const crypto = require("crypto");

exports.getUsers = (req, res, next) => {
  console.log("cont");
  let users = userModel.getUsers();
  users.then((users) => {
    console.log(users);
    res.send(users);
  });
};

exports.getUser = (req, res, next) => {
  id = req.params.id;
  let user = userModel.getUser(id);
  user.then((user) => {
    console.log(user);
    res.send(user);
  });
};

exports.createUser = (req, res, next) => {
  let users = userModel.createUser(req.body);
  users.then((users) => {
    console.log(users);
    res.send(users);
  });
};

exports.deleteUser = (req, res, next) => {
  id = req.params.id;
  let result = userModel.deleteUser(id);
  result
    .then((results) => {
      if (result.length != 0) console.log(results.affectedRows);
      else {
        console.log("no users left");
      }
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  console.log(req.body.user_id + " attempted login");
  if (req.body.user_id == "") req.body.user_id = null;
  if (req.body.user_id == "") req.body.pw = null;
  userModel
    .login({
      user_id: req.body.user_id,
      pw: req.body.pw, // change to password
    })
    .then((results) => {
      res.send(results);
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createAdmin = (req, res, next) => {
  let users = userModel.createAdmin(req.body);
  users.then((users) => {
    console.log(users);
    res.send(users);
  });
};

exports.loginAdmin = (req, res, next) => {
  console.log(req.body.staff_id + " attempted login");
  if (req.body.staff_id == "") req.body.staff_id = null;
  if (req.body.staff_id == "") req.body.pw = null;
  userModel
    .loginAdmin({
      staff_id: req.body.staff_id,
      pw: req.body.pw, // change to password
    })
    .then((results) => {
      res.send(results);
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getGenres = (req, res, next) => {
  console.log("cont");
  // let genres = userModel.getGenres();
  // genres.then((genres) => {
  //   console.log(genres);
  //   res.send(genres);
  // });
};
