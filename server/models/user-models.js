const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
    firstname:{
        type:String,
        maxLength: 100,
        trim:true
    },
    lastname:{
        type:String,
        maxLength: 100,
        trim:true
    },
    age:{
        type:Number
    },
    date:{
        type: Date,
        default: Date.now
    }
},{
 //   timestamps:true
 //   collection: "player"
});




//that is a middleware so it has the user instance 
userSchema.pre('save',async function(next){ //before save event occurs , if userSchema.post will be after save
    let user = this;  /*{ this user we will recieve before we save will do this middlware email: 'khalhjged@gmail.com', password: '123khaled', role: 'user',  _id: new ObjectId("618a63f6665ef3427da08e86"),  date: 2021-11-09T12:05:10.779Z} */

     if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
    }
    console.log(user) //after encrypting password 
    next();
});





//static function : we don't have accecc to the user to run it we have to call it passing to  it the email
userSchema.statics.emailTaken = async function(email){
    const user = await this.findOne({email});
    return !!user; //not path if email exist else the excution will kep moving forwared
}
//static is just a static function but methods you have access to the instance of the user
//static we call passing data but instance we instantiate (run )



userSchema.methods.GenerateToken =  function(){
    let user = this ; 
    const useObj= {_id : user._id.toHexString(), email : user.email}
    const token = jwt.sign(useObj ,process.env.DB_TOKEN ,{expiresIn:'1d'} )
    return token
}





userSchema.methods.deCryptPassword = async function(password){
    let user = this;
    const decrypt = await bcrypt.compare(password , user.password)
    return decrypt
}
const User =  mongoose.model("USer" , userSchema)
module.exports = {User}
