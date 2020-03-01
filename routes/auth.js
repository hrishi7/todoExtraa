
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const express = require('express');
const router = express.Router();



//@desc     Register user
//@route    Post /api/auth/register
//@access   Public
router.post('/register',
asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body;
    let user = await User.findOne({email});
    if(user){
        return res.json({
            success: false,
            data:{},
            message:'Please Provide an different email'
        })
    }

    //Create user
    user = await User.create({
        email,password
    });

    sendTokenResponse(user,200,res);
}))

//@desc     Login user
//@route    Post /api/auth/login
//@access   Public
router.post('/login',asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body;

    //validate email & password
    if(!email || !password){
        return res.json({
            success: false,
            data:{},
            message:'Please Provide an email & password'
        })
    }

    //check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.json({
            success: false,
            data:{},
            message:'Invalid Credentials'
        })
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.json({
            success: false,
            data:{},
            message:'Invalid Credentials'
        })
    }

    sendTokenResponse(user,200,res);
}))

//@desc     Logout the user / clear cookie
//@route    Get /api/auth/logout
//@access   Private

router.get('/logout',asyncHandler(async (req, res, next)=>{
    res.json({
        success:true,
        data: {}
    })
}))



//@desc     Get Current loggedin user
//@route    Get /api/auth/me
//@access   Private

router.get('/me', asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.json({
        success:true,
        data: user
    })
}))



//Get Token from model, create cookie and send response
const sendTokenResponse = (user,statusCode,res)=>{
    //create Token
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token
    })
}

module.exports = router;
