const mongoose = require("mongoose");
const validator = require("validator");
const { urlRegex } = require("../utils/validation");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: urlRegex,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Некоректный email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
