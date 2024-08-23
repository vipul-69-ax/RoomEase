const express = require("express");
const {
  create_listing,
  get_my_listings,
  get_my_listing,
  get_listings,
  request_property_visit,
  get_my_requests,
  update_property,
  reject_property_request,
  accept_property_request,
  remove_approved_request,
} = require("../controllers/listing_controller");

const router = express.Router();

router.post("/new_listing", create_listing);
router.get("/my_listings", get_my_listings);
router.get("/my_listing", get_my_listing);
router.get("/listings", get_listings);
router.post("/request_visit", request_property_visit);
router.get("/get_visit_requests", get_my_requests);
router.post("/update_property", update_property);
router.post("/reject_property_request", reject_property_request)
router.post("/accept_property_request", accept_property_request)
router.post("/remove_approved_request", remove_approved_request)

module.exports = router;
