const express = require("express")
 const bodyParser = require("body-parser")
 const mongoose = require("mongoose")
 require('dotenv').config();
 const morgan = require("morgan")
 const cors = require("cors")
 const helmet = require("helmet");

 const {ValidateToken} = require("./middleware/auth")

 const app = express()
 const userRouter = require('./Routes/api/user-routes.js');
 const articleRouter = require("./Routes/api/Articles-routes")



 const mongourl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`

 mongoose.connect(mongourl  ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}, ()=>{
    console.log("conected to db")
})
app.use(cors())


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan())
app.use(helmet());
app.use(ValidateToken);



app.use("/api/users",userRouter)
app.use("/api/articles" , articleRouter)

app.get("/"  ,(req,res)=>{
    console.log(req.user)
    res.send("welcome from home page")
})


const port = process.env.PORT || 3001;
app.listen(port,()=>{
    
    console.log(`Server running on port ${port}`)
})