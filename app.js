const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 8000 || process.env.port;
const userRouter = require("./route/user.route.js");
const bookRouter = require("./route/book.route.js");

app.use("/", userRouter);
app.use("/books", bookRouter);

app.listen(port, "0.0.0.0", () => console.log(`listening on port ${port}`));
