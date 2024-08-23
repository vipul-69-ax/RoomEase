const AuthModel = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const fs = require("fs");
const path = require("path");
const { send_password_recovery_email } = require("../utils/email_utils");
const {
  SUCCESS,
  UNEXPECTED_ERROR,
  PASSWORD_ERROR,
  USER_DOES_NOT_EXIST,
  EMAIL_NOT_SENT,
} = require("../constants");

async function authenticate(req, res) {
  try {
    const { email, password } = req.body;
    console.log("data", req.body);
    const existing_user = await AuthModel.findOne({
      email,
    });
    const token = jwt.sign(
      {
        email,
        iat: Math.floor(Date.now() / 1000),
      },
      "GK^8#yf&2%9Aq3j!Pz*6nL@WsBdE$5tY",
    );
    if (existing_user) {
      const isValidPassword = await bcrypt.compare(
        password,
        existing_user.password,
      );
      if (!isValidPassword) {
        res.json({
          user: false,
          code: PASSWORD_ERROR,
        });
        return;
      }
      res.json({
        user: true,
        code: SUCCESS,
        token: existing_user.token,
      });
    } else {
      const encrypt_password = await bcrypt.hash(password, 10);
      await AuthModel.create({
        email,
        password: encrypt_password,
        verified: false,
        token,
      });
      res.json({
        user: true,
        code: SUCCESS,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      user: false,
      code: UNEXPECTED_ERROR,
    });
  }
}

async function generate_recovery_mail(req, res) {
  console.log("called");
  try {
    const user = await AuthModel.findOne({ email: req.body.email });
    if (!user) {
      res.json({
        status: false,
        code: USER_DOES_NOT_EXIST,
      });
      return;
    }
    send_password_recovery_email(user.email, user.token, (err) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          code: EMAIL_NOT_SENT,
        });
      } else {
        res.json({
          status: true,
          code: SUCCESS,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      code: UNEXPECTED_ERROR,
    });
  }
}

function password_reset_form(req, res) {
  const token = req.query.token;

  fs.readFile(
    path.join(__dirname, "recoverPassword.html"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading HTML file:", err);
        return res.status(500).send("Internal server error");
      }

      const htmlWithToken = data.replace("{{token}}", token);
      res.send(htmlWithToken);
    },
  );
}

async function handle_password_reset(req, res) {
  const responseSchema = z.object({
    token: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, {
        message: "Password must be no more than 100 characters long",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),
  });
  try {
    responseSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await AuthModel.updateOne(
      {
        token: req.body.token,
      },
      {
        $set: { password: hashedPassword },
      },
    );
    res.send("Password Updated");
  } catch (err) {
    res.send("Invalid data passed as password.");
  }
}

module.exports = {
  authenticate,
  generate_recovery_mail,
  password_reset_form,
  handle_password_reset,
};
