const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: true
  },
  createdBy: {
    // The PHC Healthcare worker
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    // The Urban Specialist Doctor
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Open', 'In Review', 'Resolved', 'Emergency'],
    default: 'Open'
  },
  symptoms: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String
  },
  notes: {
    // Notes added by the specialist
    type: String
  },
  files: [{
    fileName: String,
    fileUrl: String,
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
