const express = require('express');
const { createPatientAndCase, getCases, uploadCaseFile, updateCase } = require('../controllers/caseController');
const { protect, authorize } = require('../middlewares/auth');
const { localUpload } = require('../middlewares/upload');

const router = express.Router();

router.use(protect); // All case routes require authentication

router.post('/patient', authorize('healthcare_worker', 'admin'), createPatientAndCase);
router.get('/', getCases);
router.post('/:id/upload', authorize('healthcare_worker', 'admin'), localUpload.single('file'), uploadCaseFile);
router.put('/:id', authorize('doctor', 'admin'), updateCase);

module.exports = router;
