'use strict'
var mongoose = require('mongoose');
var User = mongoose.model('user');
var passwordHash = require('password-hash');

exports.login = (req, res) => {
    User.findOne({'username': req.body.username}, 'username password _id', (err, data)=>{
        //Find error
        if(err){
            res.send(err);
            return;
        }
        // User not exit
        if(!data){
            res.send({status: 'false'});
            return;
        }
        // Password invalid
        let hashedPassword = data.password;
        if(!passwordHash.verify(req.body.password, hashedPassword)){
            res.send({status: 'false'});
        }
        res.json({status: 'true', id:data._id});   
    });
};  

exports.signup = (req, res) => {
    let hashedPassword = passwordHash.generate(req.body.password);
    User.find({$or:[{username:req.body.username}, {email:req.body.email}]}, (err, user) => {
        if(err){
            res.send(err);
            return;
        }
        // User Already
        if(user){
            res.send({status: 'false', message: "User Already exsit"});
            return;
        }
        // Password and confirm 
        if(req.body.password != req.body.confirm){
            res.send({status: 'false', message:""});
            return;
        }
        var new_user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword, 
            date: new Date().getTime(),
        });
        new_user.save((err, data) =>{
            if(err){
                res.send({status: 'false', message:""});
            }
            else{
                res.send({status: 'true', message:""});
            }
        });   

    });
}