const express = require('express')
const router = express.Router()
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");


const salt = bcrypt.genSaltSync(10);

router.post('/register', asyncHandler(async (req,res) => {
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } catch(e) {
      console.log(e);
      res.status(400)
      throw new Error('Invalid user data')
}
    console.log({username});
  }))

  router.post('/login', asyncHandler( async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
    //   // logged in
      jwt.sign({username,id:userDoc._id}, process.env.JWT_SECRET, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400);
      throw new Error('Invalid credentials')
    }
  
  }))
  router.get('/profile', asyncHandler( (req,res) => {
try {
  

    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, (err,info) => {
      if (err) throw new Error;
      res.json(info);
    })
   } catch (error) {
    throw new Error
    }
  }))

router.post('/logout', (req,res) => {
    res.clearCookie('token')
    res.json('loggedout')
  });
  module.exports = router