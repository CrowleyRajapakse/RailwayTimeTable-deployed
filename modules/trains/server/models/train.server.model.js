'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Train Schema
 */
var TrainSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Train name',
    trim: true
  },
  number: {
    type: String,
    default: '',
    required: 'Please fill Train number',
    trim: true
  },
  tmodel: {
    type: String,
    default: '',
    required: 'Please fill Train model',
    trim: true
  },
  powerType: {
    type: String,
    default: '',
    required: 'Please fill Train Power Type',
    trim: true
  },
  capacity: {
    type: Number,
    default: '0' ,
    required: 'Please fill Train Capacity',
    trim: true
  },
  startStation: {
    type: String,
    default: '',
    required: 'Please fill Train Start Station',
    trim: true
  },
  startTime: {
    type: String,
    default: '',
    required: 'Please fill Train Start Time',
    trim: true
  },
  endStation: {
    type: String,
    default: '',
    required: 'Please fill Train End Station',
    trim: true
  },
  endTime: {
    type: String,
    default: '',
    required: 'Please fill Train End Time',
    trim: true
  },
  picture: {
    data: Buffer,
    contentType: String
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

mongoose.model('Train', TrainSchema);
