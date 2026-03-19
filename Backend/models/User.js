const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  expenses: [
    {
      amount: Number,
      category: String,
      date: String
    }
  ],
  limits: Object
});

module.exports = mongoose.model("User", userSchema);