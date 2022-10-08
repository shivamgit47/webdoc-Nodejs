const mongoose = require("mongoose");
const validator = require("validator");

const doctorSchema = new mongoose.Schema({
    name : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    email :
    {
        type : String,
        required : true,
        unique : [true,"Email is already present"],
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email")
            }
        }
    },
    phone :
    {
        type : Number,
        min : 8,
        required : true,
        unique : true
    },
    date:
    {
        type : Date,
        default : Date.now
    },
    transaction :
    {
        type : Number,
        default : ''
    }
})
// admin schema here
const adminSchema = new mongoose.Schema({
    adminname : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    adminemail :
    {
        type : String,
        required : true,
        unique : [true,"Email is already present"],
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email")
            }
        }
    },
    adminpassword :
    {
        type : String,
        required : true
    },
    adminconfirmpassword :
    {
        type : String,
        required : true
    }
})

const medicSchema = new mongoose.Schema({
    medicname : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    medicimage : String,
    medicprice :
    {
        type : Number,
        default : ''
    },
    medicdiscount :
    {
        type : Number,
        default : ''
    }
})

const userSchema = new mongoose.Schema({
    userfirstname : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    userlastname : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    useremail :
    {
        type : String,
        required : true,
        unique : [true,"Email is already present"],
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email")
            }
        }
    },
    userphone :
    {
        type : Number,
        required : true,
        unique : true
    },
    usergender :
    {
        type : String,
        required : true
    },
    userage : 
    {
        type : Number,
        min : 0,
        max : 150,
        required : true,
        unique : true
    },
    userpassword :
    {
        type : String,
        required : true
    },
    userconfirmpassword :
    {
        type : String,
        required : true
    },

})

const apptSchema = new mongoose.Schema({
    patientname : 
    {
        type : String,
        required : true,
        minlength : 3
    },
    centername : 
    {
        type : String,
        required : true,
    },   
    doctorname : 
    {
        type : String,
        required : true,
    },
    departname : 
    {
        type : String,
        required : true,

    },
    apptdate : 
    {
        type : Date,
        required : true,
    },
    sympname :
    {
        type : String,
        required : true
    }

})

// we need to create a collection
const Doctor = new mongoose.model("Doctor",doctorSchema);
const Admin = new mongoose.model("Admin",adminSchema);
const Medic = new mongoose.model("Medic",medicSchema);
const User = new mongoose.model("User",userSchema);
const Appoint = new mongoose.model("Appoint",apptSchema);
module.exports = { Doctor, Admin , Medic ,User ,Appoint };
console.log("schema connected and collection created");