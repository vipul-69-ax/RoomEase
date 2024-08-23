const express = require("express");
const {
  authenticate,
  generate_recovery_mail,
  password_reset_form,
  handle_password_reset,
} = require("../controllers/auth_controller");

const router = express.Router();

router.post("/authenticate", authenticate);
router.post("/generate-recovery-mail", generate_recovery_mail);
router.get("/recover-password", password_reset_form);
router.post("/recover-password", handle_password_reset);

module.exports = router;
