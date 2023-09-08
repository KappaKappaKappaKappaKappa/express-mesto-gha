const mongoose = require("mongoose");

function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);
  if (isValid) return value;
  throw new Error("ID не валидно");
}
module.exports = { validateObjectId };
