const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true, 'Plaese provide a email'],
        unique: true
    },
    password:{
        type: String,
        required:[true, 'Please provide a password']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


//Sign Jwt and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id},'secret',{
        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
    })
}

//Match user entenred password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('User', UserSchema);