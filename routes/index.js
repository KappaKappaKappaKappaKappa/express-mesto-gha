const router = require("express").Router();
const { STATUS_NOT_FOUND } = require("../utils/errors");

router.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;