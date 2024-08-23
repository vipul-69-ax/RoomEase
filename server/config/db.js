const { connect } = require("mongoose");
require("dotenv").config();
const uri = process.env.DB_URL;

connect(uri);
