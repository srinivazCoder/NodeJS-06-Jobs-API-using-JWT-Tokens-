 console.log("JOBS_API"); 

require('dotenv').config();
require('express-async-errors');

// extra security packages

const helmet = require('helmet'); //HTTP headers to prevent attacks like Cross-Site-Scripting(XSS),
const cors = require('cors');
const xxs = require('xss-clean'); // Prevent attacks like Cross-Site-Scripting(XSS)
const rateLimiter = require('express-rate-limit');



const express = require('express');
const app = express();

//connectDB

const connectDB = require("./db/connect");

const authenticationUser = require('./middleware/authentication');
 
// routes

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");



// error handler

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


app.use(express.json());

//trust the first proxy server's IP address in the X-Forwarded-For header.

app.set('trust proxy', 1);


// number of requests received and processed by IP end-point
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max : 100
}));

app.use(helmet());
app.use(cors());
app.use(xxs());

app.get("/",(req,res)=>{
    res.send('Jobs API');
})

const myRouter = require('./routes/auth'); // Adjust the path accordingly
app.use('/myroute', myRouter);

// router
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticationUser,jobsRouter);


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>console.log(`Listening port ${port}... `))
        console.log("connected DB")

    }catch(err){
        console.log(err)
    }
}

start();