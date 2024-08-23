const express = require("express");
const {
  create_profile,
  get_profile,
  get_profile_details,
  update_profile,
} = require("../controllers/profile_controller");

const router = express.Router();

router.post("/profile_create", create_profile);
router.post("/profile_get", get_profile);
router.get("/profile_details", get_profile_details);
router.post("/update_profile ", update_profile);

module.exports = router;
