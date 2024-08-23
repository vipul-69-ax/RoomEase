const mongoose = require("mongoose");

const RequestsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    request_info: {
      type: [Object],
      required: true,
    },
  },
  { collection: "requests" }
);

const RequestsModel = mongoose.model("requests", RequestsSchema);

module.exports = RequestsModel;
