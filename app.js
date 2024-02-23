const config = require('./Config/appConfig')
const mongoose= require('mongoose')
const express = require('express')
const app = express();

const router = require('./Router/router')

//middleware 
app.use(express.json())

app.use('/auth', router)

const port =4000;

const connectDB  = (url)=> {
    return mongoose.connect(url)
}


const start = async () => {
    try {
        await connectDB(config.mongo_uri)
  console.log("connected to db ");
        app.listen(port, console.log(`server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}
start(); 
