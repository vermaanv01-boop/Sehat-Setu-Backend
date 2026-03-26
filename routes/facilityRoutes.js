const express = require('express');
const { getNearbyFacilities } = require('../controllers/facilityController');

const router = express.Router();

router.get('/nearby', getNearbyFacilities);

module.exports = router;
