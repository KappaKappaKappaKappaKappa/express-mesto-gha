const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

app.use("/users", require("./routes/users"));

app.use((req, res, next) => {
  req.user = {
    _id: "64ea7977954b395f456e2bc9", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
