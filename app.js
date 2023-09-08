const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/errorHandler");
const { errors } = require("celebrate");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/index"));


app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
