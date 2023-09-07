const jwt = require("jsonwebtoken");
const { STATUS_AUTH_ERROR } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(STATUS_AUTH_ERROR)
      .send({ message: "Необходима авторизация" });
  }

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    return res
      .status(STATUS_AUTH_ERROR)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
};

module.exports = authMiddleware;
