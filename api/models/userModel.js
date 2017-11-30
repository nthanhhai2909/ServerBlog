'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = new Schema({
    email:{type:String},
    username: { type:String,
             required: true,
              unique: true},  
        date:{type:String},
    password: {type:String},
});
module.exports = mongoose.model('user', User);