const express = require("express");
const mongoose = require("mongoose");
const { STATUS_NOT_FOUND } = require("./utils/errors");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

app.use((req, res, next) => {
  req.user = {
    _id: "64ea7977954b395f456e2bc9", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
