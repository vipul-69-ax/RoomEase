const {
  UNEXPECTED_ERROR,
  SUCCESS,
  USER_DOES_NOT_EXIST,
  PROPERTY_REQUEST_EXISTS,
} = require("../constants");
const AuthModel = require("../models/auth");
const ListingModel = require("../models/listing");
const ProfileModel = require("../models/profile");
const RequestsModel = require("../models/requests");

async function create_listing(req, res) {
  const user = await AuthModel.findOne({
    token: req.body.token,
  });
  if (!user) {
    res.send({
      status: false,
      code: USER_DOES_NOT_EXIST,
    });
    return;
  }
  try {
    await ListingModel.create({ ...req.body, isActive: true });
    res.send({
      status: true,
      code: SUCCESS,
    });
  } catch (err) {
    res.send({
      status: false,
      code: UNEXPECTED_ERROR,
    });
  }
}

async function get_my_listings(req, res) {
  try {
    const listings = await ListingModel.find({
      token: req.query.token,
    });
    res.send({
      status: true,
      data: listings,
    });
  } catch (err) {
    res.send({
      status: false,
    });
  }
}

async function get_my_listing(req, res) {
  console.log(req.query);
  try {
    const listings = await ListingModel.findOne({
      token: req.query.token,
      _id: req.query.id,
    });
    res.send({
      status: true,
      data: listings,
    });
  } catch (err) {
    res.send({
      status: false,
    });
  }
}

async function get_listings(req, res) {
  let { distanceRadius, facilities, utilities, position, budget } = JSON.parse(
    req.query.filters
  );
  const { latitude, longitude } = position;
  budget = budget ? parseInt(budget) : undefined;
  distanceRadius = parseInt(distanceRadius);
  console.log(distanceRadius);
  try {
    let query = {
      token: { $ne: req.query.token },
      isActive: { $eq: true },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: distanceRadius * 1000,
        },
      },
    };
    if (facilities.length > 0) {
      query["facilities"] = {
        $all: facilities,
      };
    }
    if (utilities.length > 0) {
      query["utilities"] = {
        $all: utilities,
      };
    }
    if (budget) {
      query["monthly_rent"] = {
        $lt: budget,
      };
    }

    console.log(query);
    const listings = await ListingModel.find(query);
    res.send({
      status: true,
      data: listings,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: false,
    });
  }
}

async function request_property_visit(req, res) {
  const { property_id, my_id, occupants, rent } = req.body;
  let existing_req = await ListingModel.findById(property_id);
  existing_req = existing_req.requests.filter((i) => i.requestFrom === my_id);
  if (existing_req.length !== 0) {
    res.send({
      status: false,
      code: PROPERTY_REQUEST_EXISTS,
    });
    return;
  }
  console.log(property_id);
  let request = await RequestsModel.findOneAndUpdate(
    {
      user_id: my_id,
    },
    {
      $push: {
        request_info: {
          accepted: false,
          property_id,
        },
      },
    }
  );
  if (request == null) {
    let request = await RequestsModel.create({
      user_id: my_id,
    });
    await RequestsModel.findOneAndUpdate(
      {
        user_id: my_id,
      },
      {
        $push: {
          request_info: {
            accepted: false,
            property_id,
          },
        },
      }
    );
  }
  const property = await ListingModel.findByIdAndUpdate(property_id, {
    $push: {
      requests: {
        requestFrom: my_id,
        occupants,
        rent,
      },
    },
  });
  console.log(property.full_address);
}

async function get_my_requests(req, res) {
  const token = req.query.token;
  const user = await RequestsModel.findOne({
    user_id: token,
  });
  if (!user) {
    res.send({ status: false });
    return;
  }
  let result = [];
  for (const property in user.request_info) {
    const data = await ListingModel.findById(
      user.request_info[property].property_id
    );
    const token = data._doc.token
    const dealer = await ProfileModel.findOne({
      token
    })
    result.push({
      ...data._doc,
      accepted: user.request_info[property].accepted,
      property_id: user.request_info[property].property_id,
      photo: dealer.photo,
      phone: dealer.phoneNumber,
      name: dealer.fullName
    });
  }
  res.send({ status: true, data: result });
}

async function update_property(req, res) {
  try {
    const property = await ListingModel.findById(req.body.id);
    const parsedData = {
      monthly_rent: parseInt(req.body.rent),
      occupied: parseInt(property.max_occupancy) - parseInt(req.body.spaceLeft),
      information: req.body.information,
      isActive: req.body.availableForListing,
    };
    await property.updateOne(parsedData);
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false });
  }
}

async function reject_property_request(req, res) {
  try {
    const property = await ListingModel.findById(req.body.propertyId);
    await property.updateOne({
      $pull: {
        requests: {
          requestFrom: req.body.userId,
        },
      },
    });
    const user = await RequestsModel.findOne({ user_id: req.body.userId });
    await user.updateOne({
      $pull: {
        request_info: {
          property_id: req.body.propertyId,
        },
      },
    });
    res.status(200).send({ status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false });
  }
}

async function accept_property_request(req, res) {
  const { propertyId, userId } = req.body;
  try {
    const property = await ListingModel.findById(propertyId);
    await property.updateOne({
      $pull: {
        requests: {
          requestFrom: userId,
        },
      },
    });
    let request = await RequestsModel.updateOne(
      {
        user_id: userId,
        "request_info.property_id": propertyId,
        "request_info.accepted": false,
      },
      {
        $set: { "request_info.$.accepted": true },
      }
    );
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false });
  }
}

async function remove_approved_request(req, res) {
  try {
    console.log(req.body)
    const request = await RequestsModel.findOne({
      user_id: req.body.userId,
    })
    await request.updateOne({
      $pull: {
        request_info: {
          property_id: req.body.propertyId
        }
      }
    })
    res.send({ status: true })
  }
  catch (err) {
    res.send({ status: false })
  }
}



module.exports = {
  create_listing,
  get_my_listings,
  get_my_listing,
  get_listings,
  request_property_visit,
  get_my_requests,
  update_property,
  reject_property_request,
  accept_property_request,
  remove_approved_request
};
