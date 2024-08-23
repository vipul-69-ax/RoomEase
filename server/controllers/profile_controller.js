const {
  USER_DOES_NOT_EXIST,
  SUCCESS,
  UNEXPECTED_ERROR,
} = require("../constants");
const AuthModel = require("../models/auth");
const ProfileModel = require("../models/profile");

async function create_profile(req, res) {
  const { token, image, name, phone } = req.body;
  console.log(req.body);
  const exists = await AuthModel.findOne({
    token: req.body.token,
  });
  if (!exists) {
    res.send({
      status: false,
      code: USER_DOES_NOT_EXIST,
    });
    return;
  }
  try {
    await ProfileModel.create({
      fullName: name,
      phoneNumber: phone,
      photo: image,
      token,
    });
    res.send({
      status: true,
      code: SUCCESS,
      data: {
        name,
        phone,
        photo: image,
      },
    });
  } catch (err) {
    res.send({
      status: false,
      code: UNEXPECTED_ERROR,
    });
  }
}

async function get_profile(req, res) {
  try {
    console.log(req.body);
    const user = await ProfileModel.findOne({
      token: req.body.token,
    });
    console.log(user);
    if (!user) {
      res.send({
        status: false,
        code: USER_DOES_NOT_EXIST,
      });
      return;
    }
    res.send({
      status: true,
      code: SUCCESS,
      data: {
        name: user.fullName,
        phone: user.phoneNumber,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: false,
      code: UNEXPECTED_ERROR,
    });
  }
}

async function get_profile_details(req, res) {
  const { token } = req.query;
  if (!token) {
    res.send({ status: false });
    return;
  }
  const user = await ProfileModel.findOne({
    token: token,
  });
  if (user) {
    res.send({
      data: {
        photo: user.photo,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    });
  } else {
    res.send({ status: false });
  }
  console.log(token);
}

async function update_profile(req, res){
  console.log(req.body)
}


module.exports = {
  create_profile,
  get_profile,
  get_profile_details,
  update_profile
};
