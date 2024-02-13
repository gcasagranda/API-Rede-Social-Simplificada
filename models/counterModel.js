const mongoose = require('mongoose');

const counterModel = mongoose.Schema({
    object:{ type: String, required: true },
    seq:{ type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterModel);