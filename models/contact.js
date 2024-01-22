const mongoose=require("mongoose")

const contactSchema = new mongoose.Schema({

    name: String,

    contact: String,

    email: String,
    
})


const Contact = mongoose.model("Contact", contactSchema);



module.exports = Contact;