const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: String,
  users: [String],
  password: String,
  cameras: [{
    name:String,
    ip:String,
    port:String,
    channel:String,
    username:String,
    password:String,
  }]
});

module.exports = mongoose.model('Store', StoreSchema);
