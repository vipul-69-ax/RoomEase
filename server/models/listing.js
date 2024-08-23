const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    full_address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    max_occupancy: {
      type: Number,
      required: true,
    },
    occupied: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    kitchen: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    monthly_rent: {
      type: Number,
      required: true,
    },
    information: {
      type: String,
      default: "None",
      required: true,
    },
    listing_images: {
      type: [String],
      required: true,
    },
    blueprint: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    utilities: {
      type: [String],
      required: true,
    },
    facilities: {
      type: [String],
      required: true,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    requests:{
      type:[Object]
    }
  },
  { timestamps: true, collection: "listing" }
);

const ListingModel = mongoose.model("listing", ListingSchema);

module.exports = ListingModel;
