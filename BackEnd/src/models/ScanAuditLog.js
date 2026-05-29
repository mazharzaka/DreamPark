import mongoose from 'mongoose';

const scanAuditLogSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Scan event must be associated with an authenticated agent'],
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Scan event must reference a target booking'],
  },
  actionType: {
    type: String,
    enum: ['SCAN_SUCCESS', 'SCAN_REJECTED_DUPLICATE', 'SCAN_REJECTED_DATE', 'SCAN_CANCELLED'],
    required: [true, 'Audit event must have an action type'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  outcome: {
    type: String,
    required: [true, 'Audit log must detail the transaction outcome or error message'],
  },
});

// Enforce append-only at Mongoose middleware level
scanAuditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next(new Error('ScanAuditLog entries are read-only and cannot be updated.'));
  }
 
});

const ScanAuditLog = mongoose.model('ScanAuditLog', scanAuditLogSchema);
export default ScanAuditLog;
