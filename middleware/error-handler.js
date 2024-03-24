const {CustomAPIError} = require("../errors");
const {StatusCodes} = require("http-status-codes");

const errorHandlerMiddleware = (err,req,res,next) =>{
    // console.log(typeof err)
    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || 'Something went wrong try again later'
    } 

    // if(err instanceof CustomAPIError){
    //     return res.status(err.statusCode).json({msg:err.message})
    // }

    //error when user name passoword not valid

    if(err.name==='ValidationError'){
        customError.msg = Object.values((err.errors)).map((item)=>item.message).join(",");
        customError.statusCode = 400
    }

    //Duplicate values

    if(err.code && err.code === 11000){
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, Please choose another value`;
        customError.statusCode = 400
    }

    //if job id not matched

    if(err.name === 'CastError'){
        customError.msg = `No item found with id ${err.value}`;
        customError.statusCode = 404;
    }
    // return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    return  res.status(customError.statusCode).json({msg:customError.msg});
}

module.exports = errorHandlerMiddleware;