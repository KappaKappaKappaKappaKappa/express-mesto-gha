const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError("Необходима авторизация");
  }

  let payload;

  try {
    payload = jwt.verify(token, "secret-key");
  } catch (err) {
    return next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;

  return next();
};

module.exports = authMiddleware;
