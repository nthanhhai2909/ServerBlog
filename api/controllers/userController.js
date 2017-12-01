
'use strict'
var mongoose = require('mongoose');
var User = mongoose.model('user');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    // check data client send invalid
    if((typeof req.body.username == 'undefined') 
        || (typeof req.body.password == 'undefined')){

        res.json({status: 'false'});
        return;
    }

    // verify account
     User.findOne({'username': req.body.username}, 'username password _id', (err, data)=>{
        //Find error
        if(err){
            res.json(err);
            return;
        }
        // User not exit
        if(typeof data == 'undefined'){
            res.json({status: 'false'});
            return;
        }
        // Password invalid
        let hashedPassword = data.password;

        if(!passwordHash.verify(req.body.password, hashedPassword)){
            res.json({status: 'false'});
            return;
        }

        // award token for account login & check is login befor
        if(typeof req.body.token == 'undefined'){
            let token = jwt.sign({username: req.body.username, iat: Math.floor(Date.now() / 1000)}, 'shhhhh');
            res.json({status: 'true', id:data._id, token: token}); 
            return;
        }
        // verify a token symmetric
        jwt.verify(req.body.token, 'shhhhh', (err, decore) => {
            if(err){
                res.json({status:'false'});
                return;
            }
            if(Math.floor((Date.now() / 1000)) <=  (decore.iat + 100* 20)){
                console.log('hihi');
                let token = jwt.sign({ username: req.body.username, iat:  Math.floor(Date.now() / 1000) }, 'shhhhh');
                res.json({status: 'true', id:data._id, token: token}); 
                return;
            }
            else{
                res.json({status: 'false'});
            }

        });
        
    });

    
      

    
};  

exports.signup = (req, res) => {

    if((typeof req.body.username == 'undefined')
         || (typeof req.body.password == 'undefined')
            || typeof req.body.confirm == 'undefined'
            || typeof req.body.email == 'undefined'){
        res.json({status: 'false'});
        return;
    }

    let hashedPassword = passwordHash.generate(req.body.password);
    User.find({$or:[{username:req.body.username}, {email:req.body.email}]}, (err, user) => {
        if(err){
            res.json(err);
            return;
        }
        // User Already
        if(user.length > 0){
            res.send({status: 'false', message: "User Already exsit"});
            return;
        }
        // Password and confirm 
        if(req.body.password != req.body.confirm){
            res.json({status: 'false', message:""});
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
                res.json({status: 'false', message:""});
            }
            else{
                res.json({status: 'true', message:""});
            }
        });   

    });
}