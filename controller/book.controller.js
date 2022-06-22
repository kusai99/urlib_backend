const bookModel = require("../model/book.model");
const crypto = require("crypto");

exports.getGenres = (req, res, next) => {
  console.log("cont");
  let genres = bookModel.getGenres();
  genres.then((genres) => {
    console.log(genres);
    res.send(genres);
  });
};
