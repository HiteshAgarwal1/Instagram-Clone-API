const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')

const User = mongoose.model("User")

router.get('/', (req, res) => {
    res.send("Hello");
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({error: "All the fields are mandatory!"});
    }
    User.findOne({email:email}).then((dbUser) => {
        if(dbUser){
            return res.status(400).json({error: "User already exists!"});
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
            user.save().then(user => {
                res.json({message: "Successfully saved!"});
            }).catch(err =>{
                console.log("Error : ", err);
            });
        }); 
    });
});

router.get('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({error: "All fields are mandatory!"});
    }
    User.findOne({email:email})
    .then((dbUser) => {
        if(!dbUser){
            return res.status(400).json({error: "The email is not registered with us!"});
        }
        bcrypt.compare(password, dbUser.password)
        .then(isMatch => {
            if(isMatch){
                const token = jwt.sign({_id: dbUser._id}, JWT_SECRET )
                return res.json({token: token})
            }
            else{
                return res.status(400).json({error: "You have entered the wrong password!"});
            }
        })
        .catch(err => {
            console.log("Error:", err);
    })
    })
});


module.exports = router