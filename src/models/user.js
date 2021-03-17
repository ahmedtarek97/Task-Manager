const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        unique: true,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('The password cannot include the word \'password\'');
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true,          

        }
    }]
})
// function used for each user
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user.id.toString()},'thismynodejscourse')

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

//function shared by all the users
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid Email or Password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw Error('Invalid Email or Password');
    }
    return user;
}

// hash the plain text password before saving i the db
userSchema.pre('save', async function(next){ // the function should be the standred function because of this binding
    // this gives access to the user going to be saved
    const user = this;

    // to check if the password is modified by the user
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }

    // next() is used to signal the end of the file
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;