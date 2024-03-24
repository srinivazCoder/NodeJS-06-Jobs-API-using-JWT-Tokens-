
const User = require("../models/User")
const {StatusCodes} = require('http-status-codes');
const { BadRequestError ,UnauthenticatedError}  = require("../errors");

const jwt = require("jsonwebtoken");


const register = async(req,res)=>{
    const {name,password,email} = req.body;
    console.log(name,password,email)
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password,salt);

    // const tempUser = {name,email,password:hashedPassword}

    // if(!name || !password || !email){
    //     throw new BadRequestError('Please provide name, email and password')
    // }

    const user = await User.create({...req.body})
    console.log("user",user)
    const token = user.createJWT();


    // const token = jwt.sign({userId:user_id,name:user.name},'jwtSecret',{expiresIn:'30d'})
    
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})

}
const login = async(req,res)=>{
    const {email,password} = req.body;

    // if(!email || !password){
    //     throw new BadRequestError('Please provide name, email and password')
    // }

    const user = await User.findOne({email});

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user:{name:user.name},token})



}

// module.exports = {register,login}

module.exports= {register,login};