const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { validateObjectId } = require("../utils/validateObjectId");

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().custom(validateObjectId),
    }),
  }),
  getUser
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i
      ),
    }),
  }),
  updateAvatar
);

module.exports = router;
