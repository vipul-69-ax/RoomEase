const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    office: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);

const AuthModel = mongoose.model("users", authSchema);

module.exports = AuthModel;
