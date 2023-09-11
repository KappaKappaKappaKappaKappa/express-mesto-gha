const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { validateObjectId } = require("../utils/validateObjectId");
const { urlRegex } = require("../utils/validation");

const paramsValidationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateObjectId),
  }),
};

const {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardDislike,
} = require("../controllers/cards");

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(urlRegex),
    }),
  }),
  createCard,
);
router.delete("/:cardId", celebrate(paramsValidationConfig), deleteCard);
router.put("/:cardId/likes", celebrate(paramsValidationConfig), cardLike);
router.delete("/:cardId/likes", celebrate(paramsValidationConfig), cardDislike);

module.exports = router;
