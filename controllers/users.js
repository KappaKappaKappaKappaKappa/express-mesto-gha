const User = require("../models/user");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_NO_CONTENT
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        res
          .status(STATUS_NO_CONTENT)
          .send();
        return;
      } else {
        res.status(STATUS_OK).send({ data: users });
      }
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
          .status(STATUS_NO_CONTENT)
          .send({ message: "Запрашиваемый пользователь не найден" });
        return;
      } else {
        res.status(STATUS_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(STATUS_BAD_REQUEST).send({ message: "Некорректные данные" });
        return;
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(STATUS_BAD_REQUEST).send({ message: "Некорректные данные" });
        return;
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
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
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(STATUS_BAD_REQUEST).send({ message: "Некорректные данные" });
        return;
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
      res.status(STATUS_OK).send({ data: newAvatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(STATUS_BAD_REQUEST).send({ message: "Некорректные данные" });
        return;
      } else {
        res
          .status(STATUS_SERVER_ERROR)
          .send({ message: "Внутренняя ошибка сервера" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
