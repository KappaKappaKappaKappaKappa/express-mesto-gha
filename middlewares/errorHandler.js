errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message = "Произошла ошибка на стороне сервера" } = err;

  res.status(statusCode).send({ message });

  next();
};

module.exports = { errorHandler };
