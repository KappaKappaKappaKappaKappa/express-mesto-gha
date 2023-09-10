const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const AuthError = require("../errors/AuthError");
const ConflictError = require("../errors/ConflictError");

const { STATUS_OK, STATUS_CREATED } = require("../utils/errors");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_OK).send({ data: users });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError("Запрашиваемый пользователь не найден");
    }
    return res.status(STATUS_OK).send({ data: user });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный id пользователя"));
    }
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    if (password.length < 8) {
      throw new BadRequestError("Пароль должен быть минимум 8 символов");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(STATUS_CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные в метод создания пользователя"
        )
      );
    }

    if (err.code === 11000) {
      return next(
        new ConflictError("Пользователь с таким email уже существует")
      );
    }

    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError("Пользователь с указанным id не найден");
    }

    res.status(STATUS_OK).send({ data: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные в метод обновления профиля пользователя"
        )
      );
    }
    return next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new NotFoundError("Пользователь с указанным id не найден");
    }
    res.status(STATUS_OK).send({ data: user });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные в метод обновления аватара пользователя"
        )
      );
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AuthError("Неправильные почта или пароль");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new AuthError("Неправильные почта или пароль");
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, "secret-key", { expiresIn: "1w" });

    res.cookie("jwt", token, { httpOnly: true });
    res.status(STATUS_OK).send({
      data: "Успешная авторизация!",
    });
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      throw new NotFoundError("Пользователь не найден");
    }

    return res.status(STATUS_OK).send({ data: currentUser });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный id пользователя"));
    }
    return next(err);
  }
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
