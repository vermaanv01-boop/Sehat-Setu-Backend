const Case = require('../models/Case');
const Patient = require('../models/Patient');
const io = require('../sockets');

// @desc    Create a new patient and empty case
// @route   POST /api/cases/patient
// @access  Private (Healthcare Worker)
exports.createPatientAndCase = async (req, res) => {
  try {
    const { firstName, lastName, dob, gender, contactNumber, address, symptoms } = req.body;

    // 1. Create Patient
    const patient = await Patient.create({
      firstName,
      lastName,
      dob,
      gender,
      contactNumber,
      address,
      registeredBy: req.user.id
    });

    // 2. Create Initial Case
    const newCase = await Case.create({
      patient: patient._id,
      createdBy: req.user.id,
      symptoms,
      status: 'Open'
    });
    
    // Notify all connected specialists (or all users) of a new case
    if(io.getIo()) {
      io.getIo().emit('new_case', newCase);
    }

    res.status(201).json({ success: true, patient, case: newCase });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('patient').sort('-createdAt');
    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Upload file for a case
// @route   POST /api/cases/:id/upload
// @access  Private
exports.uploadCaseFile = async (req, res) => {
  try {
    const caseObj = await Case.findById(req.params.id);
    if (!caseObj) return res.status(404).json({ success: false, message: 'Case not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });

    caseObj.files = caseObj.files || [];
    caseObj.files.push({
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id
    });

    await caseObj.save();
    res.status(200).json({ success: true, data: caseObj });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update case status & notes (Specialist taking action)
// @route   PUT /api/cases/:id
// @access  Private (Doctor)
exports.updateCase = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    let caseObj = await Case.findById(req.params.id);

    if (!caseObj) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Assign to doctor if not already assigned
    if (!caseObj.assignedTo && req.user.role === 'doctor') {
      caseObj.assignedTo = req.user.id;
    }

    if (status) caseObj.status = status;
    if (notes) caseObj.notes = notes;

    await caseObj.save();
    
    // Notify users of case update
    if(io.getIo()) {
        io.getIo().emit('case_updated', caseObj);
    }

    res.status(200).json({ success: true, data: caseObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
