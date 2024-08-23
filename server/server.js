const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRouter = require("./routes/auth_route");
const profileRouter = require("./routes/profile_route");
const listingRouter = require("./routes/listing_route");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/profile_images", express.static("profile_images"));

db;

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/listing", listingRouter);

app.listen(3000, () => console.log(`http://localhost:3000`));

module.exports = app;
