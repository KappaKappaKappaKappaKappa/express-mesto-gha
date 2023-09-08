const router = require("express").Router();
const { STATUS_NOT_FOUND } = require("../utils/errors");
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");

const { createUser, login } = require("../controllers/users");

router.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

router.use(
  "/sign-in",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
router.use(
  "/sign-up",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i
      ),
    }),
  }),
  createUser
);

router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.use((req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;
