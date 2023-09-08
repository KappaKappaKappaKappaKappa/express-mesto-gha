module.exports = (err, req, res, next) => {
  const { status = 500, message = "Произошла ошибка на стороне сервера" } = err;
  res.status(status).send({ message });

  next();
};
