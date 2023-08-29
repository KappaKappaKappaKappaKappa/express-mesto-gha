const Card = require("../models/card");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
} = require("../utils/errors");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_OK).send({ data: cards });
    })
    .catch((err) => {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
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

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      } else {
        res.status(STATUS_OK).send({ message: `Карточка успешно удалена` });
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

const cardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      } else {
        res.status(STATUS_OK).send({ likes: card.likes });
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

const cardDislike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена" });
        return;
      } else {
        res.status(STATUS_OK).send({ likes: card.likes });
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardDislike,
};
