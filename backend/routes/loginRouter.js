const express = require('express');
const atob = require('atob');

const appForLogin = express.Router();

const users = require('../data/users.json');


appForLogin.post('/', (req,res) => {
    const { email, password } = req.body;
    console.log(req.body)

   
    const user = users.find(u => u.email === email);

    console.log(user);
    // if(!user){
    //     return res.status(404).json({ message: 'User not found' });
    // }

    const decodedPassword = atob(user.password);
    
    if(password !== decodedPassword){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: "Login Successful", user});


});

module.exports = appForLogin;