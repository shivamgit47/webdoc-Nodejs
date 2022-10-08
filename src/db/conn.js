const mongoose = require("mongoose");
// creaing a dataabase
mongoose.connect("mongodb://localhost:27017/webdoc-database",{
}).then(() => {
    console.log("connection successfull....");
}).catch((err)=> {
    console.log(err);
    console.log("cannot connect") 
})