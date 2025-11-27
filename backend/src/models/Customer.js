const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  notes: {
    type: String,
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

customerSchema.index({ name: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
