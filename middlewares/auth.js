const jwt = require("jsonwebtoken");
const { STATUS_AUTH_ERROR } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_AUTH_ERROR)
      .send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    return res
      .status(STATUS_AUTH_ERROR)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next()
};

module.exports = authMiddleware;
