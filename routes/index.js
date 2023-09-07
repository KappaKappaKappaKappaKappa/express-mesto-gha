const router = require("express").Router();
const { STATUS_NOT_FOUND } = require("../utils/errors");
const auth = require('../middlewares/auth')
const {
  createUser,
  login
} = require('../controllers/users')

router.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

router.use('/sign-in', login);
router.use('/sign-up', createUser);

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));




router.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;