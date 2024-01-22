require("dotenv").config()
const express=require("express")
const app=express();
const mongoose=require("mongoose")
const cors=require("cors")
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Database running");
}).catch((err)=>{
    console.log(err);
})
app.use(cors())
importfeature = require("./routes/contactapi")

app.use(importfeature)

app.listen(3500,()=>{
    console.log(`listening ${process.env.PORT}`);
})