const Card = require("../models/card");
const mongoose = require("mongoose");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_NO_PERMISSON,
} = require("../utils/errors");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_OK).send({ data: cards });
  } catch (err) {
    res
      .status(STATUS_SERVER_ERROR)
      .send({ message: "Внутренняя ошибка сервера" });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(STATUS_CREATED).send({ data: card });
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

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const currentUser = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Карточка с указанным id не найдена." });
    }

    if (card.owner.toString() !== currentUser.toString()) {
      return res
        .status(STATUS_NO_PERMISSON)
        .send({ message: "Вы не можете удалять чужие карточки" });
    }

    const deletedCard = await Card.findByIdAndRemove(cardId);
    res.status(STATUS_OK).send({ message: `Карточка успешно удалена` });
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

const cardLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Передан несуществующий id карточки." });
    } else {
      res.status(STATUS_OK).send({ likes: card.likes });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(STATUS_BAD_REQUEST).send({
        message: "Переданы некорректные данные для постановки/снятии лайка.",
      });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};

const cardDislike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      res
        .status(STATUS_NOT_FOUND)
        .send({ message: "Передан несуществующий id карточки." });
    } else {
      res.status(STATUS_OK).send({ likes: card.likes });
    }
  } catch (err) {
    if (err.name === "CastError") {
      res.status(STATUS_BAD_REQUEST).send({
        message: "Переданы некорректные данные для постановки/снятии лайка.",
      });
    } else {
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardDislike,
};
