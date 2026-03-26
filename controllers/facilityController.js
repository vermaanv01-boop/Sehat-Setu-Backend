const User = require('../models/User');

// @desc    Get nearby health facilities
// @route   GET /api/facilities/nearby
// @access  Public
exports.getNearbyFacilities = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query; // maxDistance default 10km

    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'Please provide longitude and latitude' });
    }

    const facilities = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('name facilityName location role');

    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
