const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: String,
  timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('blog-platform', blogSchema);
