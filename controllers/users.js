const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_AUTH_ERROR,
} = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(STATUS_OK).send({ data: users });
  } catch (err) {
    res
      .status(STATUS_SERVER_ERROR)
      .send({ message: "Внутренняя ошибка сервера" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    } else {
      res.status(STATUS_OK).send({ data: user });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Переданы некорректные данные" });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    if (password.length < 8) {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Пароль должен быть минимум 8 символов" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(STATUS_CREATED).send({ data: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Переданы некорректные данные" });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!user) {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Пользователь с указанным id не найден" });
    } else {
      res.status(STATUS_OK).send({ data: user });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Переданы некорректные данные" });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};


const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Пользователь с указанным id не найден" });
    } else {
      res.status(STATUS_OK).send({ data: user });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Переданы некорректные данные" });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

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

const getCurrentUser = (req, res) => {
  const currentUser = req.user;
  res.status(STATUS_OK).send({ data: currentUser });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
