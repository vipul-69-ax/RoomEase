const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "profile",
  },
);

const ProfileModel = mongoose.model("profile", profileSchema);

module.exports = ProfileModel;
