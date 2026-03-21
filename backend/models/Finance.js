const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  type:        { type: String, enum: ['income', 'expense'], required: true },
  category:    { type: String, required: true },
  amount:      { type: Number, required: true },
  description: { type: String },
  date:        { type: Date, default: Date.now },
  source:      { type: String, enum: ['online', 'pos', 'manual'], default: 'manual' },
  referenceId: { type: String },
  recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Finance', financeSchema);
