const express = require("express");
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");
require("./db/conn");
const { Doctor ,Admin ,Medic ,User ,Appoint}  = require("./models/docregister");



const app = express();
const port = process.env.PORT || 5000;

// setting the path
const staticPath = path.join(__dirname,"../public");
const templatePath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatePath);

hbs.registerPartials(partialsPath);

//storage
const Storage = multer.diskStorage({
    
    destination : "./public/uploads/images",
    filename : (req,file,cb)=> {
        cb(null,file.originalname);
    },
});
const upload = multer({
    storage : Storage
}).single("medicimage")




// routing -------------------------------------

//routing doctor website start
app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/index",(req,res)=>{
    res.render("index");
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/departmentlist",(req,res)=>{
    res.render("departmentlist");
})
app.get("/doctorslist",(req,res)=>{
    res.render("doctorslist");
})
// user registration
app.get("/userreg",(req,res)=>{
    res.render("userreg");
})
// user login
app.get("/userlogin",(req,res)=>{
    res.render("userlogin");
})
app.get("/appointment",(req,res)=>{
    res.render("appointment");
})

app.get("/showappointment", (req,res)=>{
        
    Appoint.find({},(err,docs)=>{
            // console.log(docs);
            if(!err)
            {
        res.status(201).render("showappointment",{
             list : docs
            });
            }
        else
        {console.log("error in retreiving");}
        });
    })



// admin registeration
app.get("/adminreg",(req,res)=>{
    res.render("adminreg");
})
// admin login
app.get("/adminlogin",(req,res)=>{
    res.render("adminlogin");
})

app.get("/medicshop",(req,res)=>{
    Medic.find({},(err,docs)=>{
        // console.log(docs);
        if(!err)
        {
    res.status(201).render("medicshop",{
         list : docs
        });
        }
    else
    {console.log("error in retreiving");}
    });
})
app.get("/welocomeadmin",(req,res)=>{
    res.render("welcomeadmin");
})
app.get("/createmedicshop",(req,res)=>{
    res.render("createmedicshop");
})
//viewing users in admin panel
app.get("/viewuser", (req,res)=>{
        
    User.find({},(err,docs)=>{
            // console.log(docs);
            if(!err)
            {
        res.status(201).render("viewuser",{
             listx : docs
            });
            }
        else
        {console.log("error in retreiving");}
        });
    })
// viewing users by id for updating details
app.get("/:id", (req,res)=>{
        
    User.findById({_id : req.params.id},(err,docs)=>{

            console.log(req.params.id);
            
            if(!err)
            {
        res.status(201).render("userreg",{
             viewtitle : "Update ",
             listx : docs
             
            });
            }
        else
        {console.log("....");}
        })
    })
//deleting users by id
    // deleting customers
    app.get("/delete/:id",(req,res)=>{
        User.findByIdAndRemove(req.params.id,(err,docs)=>{
            if(!err)
            {
                res.redirect("/viewuser");
            }
            else
            {
                console.log("error in deleeting customer..." +err)
            }
        })
    })

    
// admin registration post
app.post("/adminreg",async(req,res)=>{
    try
    {
        const password = req.body.adminpassword;
        const cpassword = req.body.adminconfirmpassword;
        
        if(password === cpassword)
        {
            const registerAdmin = new Admin({
                adminname : req.body.adminname,
                adminemail : req.body.adminemail,
                adminpassword : req.body.adminpassword,
                adminconfirmpassword : req.body.adminconfirmpassword

            })
            const registeredAdmin = await registerAdmin.save();
            res.status(201).render("adminlogin");
        }
        else
        {
            res.send("password nhi hora match");
        }
    }
    catch(error)
    {
        res.status(400).send(error);
    }
})

// admin login post check
app.post("/adminlogin",async(req,res)=>{
    try
    {
        const email = req.body.adminemailo;
        const password = req.body.adminpasswordo;
        
        const ademail = await Admin.findOne({adminemail:email});
        console.log(ademail);
        console.log(`const email is ${email}`);
        console.log(`const password is ${password}`);
        if(ademail.adminpassword === password)
        {
            res.status(201).render("welcomeadmin");
        }
        else
        {
            res.send("password isnt matching");
        }
    }
    catch(error)
    {
        res.status(400).send("Inavlid Admin Details");
    }
})

// medic cart post
app.post("/createmedicshop",(req,res)=>{
        upload(req,res,(err)=>{
            if(err)
            {
                console.log(err);
                console.log("image couldn't upload");
            }
            else
            {
            const medicCart = new Medic({
            medicname : req.body.medicname,
            medicimage : req.file.filename,
            medicprice : req.body.medicprice,
            medicdiscount : req.body.medicdiscount
                })
            

        medicCart.save()
        .then(()=>res.status(201).render("createmedicshop"))
        .catch(err=>console.log(err));
        console.log(req.body);
        console.log(req.file);
            }
     })
})

// user registration post
app.post("/userreg",(req,res)=>{
    if(req.body._id == '')
    insertRecord(req,res);
    else
    updateRecord(req,res);
});

function insertRecord(req,res)
{   
    var insertuser = new User();
    insertuser.userfirstname = req.body.userfirstname;
    insertuser.userlastname = req.body.userlastname;
    insertuser.useremail = req.body.useremail;
    insertuser.userphone = req.body.userphone;
    insertuser.usergender = req.body.usergender;
    insertuser.userage = req.body.userage;
    insertuser.userpassword = req.body.userpassword;
    insertuser.userconfirmpassword = req.body.userconfirmpassword;
    console.log(insertuser);
    insertuser.save((err,docs)=>
    {
        if(!err)
        res.redirect("userlogin");
        else
        {
            console.log("error during inserting");
        }
    });
}
// updating users by id in Admin panel
function updateRecord(req,res)
{
    
    User.findByIdAndUpdate(
        { _id:req.body._id}, req.body, { new : true},(err,docs)=> {
            
            if(!err)
            {
                res.redirect("viewuser");
            }
            else
            {   console.log(err);
                console.log("error in upadting");
            }
        });
}

// user login post

app.post("/userlogin",async(req,res)=>{
    try
    {
        const emails = req.body.useremailo;
        const passwords = req.body.userpasswordo;
        
        const usmail = await User.findOne({useremail:emails});
        console.log(usmail);
        console.log(`const email is ${emails}`);
        console.log(`const password is ${passwords}`);
        if(usmail.userpassword === passwords)
        {
            res.status(201).render("appointment");
            // res.status(400).send("logged in user");
            console.log("--------------logged in user------------");
        }
        else
        {
            res.send("password isnt matching");
        }
    }
    catch(error)
    {
        res.status(400).send("Inavlid Admin Details");
    }
})

// appointmnet post
app.post("/appointment",async(req,res)=>{
    try
    {  
        const registerappmt = new Appoint({
                patientname : req.body.patientname,
                centername : req.body.centername,
                doctorname : req.body.doctorname,
                departname : req.body.departname,
                apptdate : req.body.apptdate,
                sympname : req.body.sympname
                
            })
            const registerAppointment = await registerappmt.save();
            res.status(201).render("showappointment")
            
        }
    catch(error)
    {
        res.status(400).send(error);
    }
})





// server create
app.listen(port,()=>{
    console.log(`connection is setup at ${port}`);
})