const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        console.log("Такого пользователя не существует");
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
