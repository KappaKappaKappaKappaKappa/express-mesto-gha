const router = require("express").Router();
const { STATUS_NOT_FOUND } = require("../utils/errors");

router.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

router.use((req, res, next) => {
  req.user = {
    _id: "64ea7977954b395f456e2bc9", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;