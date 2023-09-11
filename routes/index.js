const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const { urlRegex } = require("../utils/validation");

const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

router.get("/", (req, res) => {
  res.send("Сервер работает и ждет запросы, все круто!");
});

router.use(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        urlRegex
      ),
    }),
  }),
  createUser,
);

router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.use(() => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

module.exports = router;
