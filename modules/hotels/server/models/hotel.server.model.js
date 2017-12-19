'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hotel Schema
 */
var HotelSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Hotel name',
    trim: true
  },
  location: {
    type: String,
    default: '',
    required: 'Please fill Hotel location',
    trim: true
  },
  contactNo: {
    type: Number,
    default: 0,
    required: 'Please fill Hotel location',
    trim: true
  },
  facilities: {
    type: String,
    default: '',
    required: 'Please fill Hotel location',
    trim: true
  },
  website: {
    type: String,
    default: '',
    required: 'Please fill Hotel location',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Hotel', HotelSchema);
