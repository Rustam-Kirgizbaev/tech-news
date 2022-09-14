const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expire: 2592000,
  },
});

module.exports = mongoose.model("news", newsSchema);
