const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_AUTH_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send({ data: users });
    })
    .catch((err) => {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else {
        res.status(STATUS_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (password.length < 8) {
    res
      .status(STATUS_BAD_REQUEST)
      .send({ message: "Пароль должен быть минимум 8 символов" });
    return;
  }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        res.status(STATUS_CREATED).send({ data: user });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res
            .status(STATUS_BAD_REQUEST)
            .send({ message: "Переданы некорректные данные" });
        } else {
          res
            .status(STATUS_SERVER_ERROR)
            .send({ message: "Внутренняя ошибка сервера" });
        }
      });
  });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Пользователь с указанным id не найден" });
      } else {
        res.status(STATUS_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((newAvatar) => {
      if (!newAvatar) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Пользователь с указанным id не найден" });
      } else {
        res.status(STATUS_OK).send({ data: newAvatar });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
    });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Неправильные почта или пароль");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Error("Неправильные почта или пароль");
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, "secret-key", { expiresIn: "1w" });

    res.cookie("jwt", token, { httpOnly: true });
    res.status(STATUS_OK).send({ message: "Аутентификация прошла успешно" });
  } catch (err) {
    res.status(STATUS_AUTH_ERROR).send({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
