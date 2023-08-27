const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId) {
    res.send({ message: "Такой карточки нет" });
    return;
  }

  Card.findByIdAndRemove(cardId)
    .then((deletedCard) => {
      res.send({ message: `Карточка ${deletedCard} успешно удалена` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const cardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.send({ likes: card.likes });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const cardDislike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.send({ likes: card.likes });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardDislike,
};
