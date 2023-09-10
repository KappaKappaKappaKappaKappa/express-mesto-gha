const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

const { STATUS_OK, STATUS_CREATED } = require("../utils/errors");

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(STATUS_OK).send({ data: cards });
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(STATUS_CREATED).send({ data: card });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные в метод создания карточки"
        )
      );
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const currentUser = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError("Карточка с указанным id не найдена.");
    }

    if (card.owner.toString() !== currentUser.toString()) {
      throw new ForbiddenError("Вы не можете удалять чужие карточки");
    }

    await Card.deleteOne(card);
    res.status(STATUS_OK).send({ message: `Карточка успешно удалена` });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Переданы некорректные данные"));
    }
    return next(err);
  }
};

const cardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      throw new NotFoundError("Передан несуществующий id карточки.");
    }

    res.status(STATUS_OK).send({ likes: card.likes });
  } catch (err) {
    if (err.name === "CastError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные для постановки/снятии лайка."
        )
      );
    }
    return next(err);
  }
};

const cardDislike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      throw new NotFoundError("Передан несуществующий id карточки.");
    }

    res.status(STATUS_OK).send({ likes: card.likes });
  } catch (err) {
    if (err.name === "CastError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные для постановки/снятии лайка."
        )
      );
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardDislike,
};
