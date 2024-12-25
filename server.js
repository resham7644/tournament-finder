var express=require("express");
var fileuploader = require("express-fileupload");
var app = express();
var cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:'resham7644@gmail.com',
            pass:'wguzmijuhjzksxbw',
        }

    }
);

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });

    console.log("Email Sent");
}

app.get("/send-email", async (req, res) => {
    try {
        const { toMail } = req.query; // Get user's email from query params

        if (!toMail) {
            return res.status(400).send("User email is required!");
        }

        // Message details
        const adminEmail = "resham7644@gmail.com"; // Your email address
        let subject = req.query.subMail; // Subject for your email
        const message = `<p>You received an email from: <b>${toMail}</b></p><hr><br>`+req.query.msgMail;

        // Send the email to you (admin)
        await sendMail(adminEmail, subject, message);

        res.send("Your email has been sent successfully!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Failed to send email. Try again later.");
    }
});


app.get("/signup-email", async (req, res) => {
    try {
        const { toMail, subMail, msgMail } = req.query; // Get email, subject, and message from query params
        await sendMail(toMail, subMail, msgMail);
        res.send('Email Sent Successfully');
        console.log('Mail Sent');
        
    } catch (err) {
        console.log(err);
        
        res.status(500).send(err.message);
    }
});

var mysql2 = require("mysql2");
let config = "mysql://avnadmin:AVNS_mCY4C3thg3hpDN2o3pB@mysql-f0cad86-resham7644-7422.e.aivencloud.com:18311/defaultdb";

var mysql = mysql2.createConnection(config);

cloudinary.config({ 
    cloud_name: 'doeunlxxa', 
    api_key: '875193351841854', 
    api_secret: 'u6wtPrtZ6rTvDFC0hUiT7aenc9o' // Click 'View API Keys' above to copy your API secret
});

mysql.connect(function(err){
    if(err==null)
        console.log("Connected to Aiven Database Successfully");
    else
        console.log(err.message+"######");
})

app.listen(7644,function(){
    console.log("Server Started");
})

app.use(express.static('public'));

app.get("/",function(req,resp){
    let path = __dirname+"/public/index.html";
    resp.sendFile(path);
})

app.get("/find-tournaments",function(req,resp){
    let path2 = __dirname+"/public/tournament-finder.html";
    resp.sendFile(path2);
})
app.get("/signup",function(req,resp){
    
    mysql.query("insert into userss values(?,?,?)",[req.query.txtmail,req.query.txtpwd,req.query.utype],function(err){
        if(err==null)
            resp.send("Record Saved");
        else
        resp.send(err.message);
    })
});

app.get("/check-email",function(req,resp){
    let email = req.query.txtMail;
    if (!email) {
        resp.status(400).send("Email parameter is missing.");
        return;
    }
    mysql.query("select * from userss where Email=?",[email],function(err,jsonArray){
        if(err!=null){
            resp.send(err.message);
        }
        else{
            resp.send(jsonArray);
        }
    })
});
app.get("/login",function(req,resp){
    
    mysql.query("select * from userss where Email=? and Password=?",[req.query.txtmail,req.query.txtpwd],function(err,jsonArray){
        if(err!=null)
            resp.send(err.message);
        else
        {
            resp.send(jsonArray);
           // if(jsonArray.length==1)
          //      resp.send("Logged in Successfully");
          //  else
           //     resp.send("Invalid Credentials")
        }
    })
});

app.use(fileuploader());
app.use(express.urlencoded(true));

app.get("/dashboard",function(req,resp){
    let path = __dirname+"/public/dashorganizer.html";
    resp.sendFile(path);
})

app.get("/profile",function(req,resp){
    let path = __dirname+"/public/profileorganizer.html";
    resp.sendFile(path);
})

app.post("/save-profile",async function(req,resp)
{
    try{
        console.log(req.body);
        
     //   console.log(req.body.selgame)
        //let game = req.body.selgame;
       // let selgame = game.join(",");
        //console.log(selgame);
        let filename = "";
        if(req.files==null)
        {
            filename = nopic.jpg;
        }
        else
        {
            filename=req.files.proofpic.name;
            let path = __dirname+"/public/uploads/"+filename;
           // console.log(path);
            req.files.proofpic.mv(path);

            await cloudinary.uploader.upload(path).then(function(result){
                filename = result.url;
                console.log(filename);
            });
        }
        req.body.picpath = filename;

        mysql.query("insert into orga_profile value(?,?,?,?,?,?,?,?,?)",[req.body.txtmail,req.body.txtorg,req.body.txtnumber,req.body.txtaddress,req.body.txtcity,req.body.selproof,req.body.picpath,req.body.selgame,req.body.txttour],function(err){
            if(err==null)
                resp.send("Record Saved Successfully");
            else
                resp.send(err.message);
            })
        }
        catch(error){
            console.log(error);
        }
   
})

app.post("/update-profile",async function(req,resp){
    try{
   // let game = req.body.selgame;
      //  let selgame = game.join(",");
      //  console.log(selgame);
        let filename = "";
        if(req.files==null)
        {
            filename = nopic.jpg;
        }
        else
        {
            filename=req.files.proofpic.name;
            let path = __dirname+"/public/uploads/"+filename;
           // console.log(path);
            req.files.proofpic.mv(path);

            await cloudinary.uploader.upload(path).then(function(result){
                filename = result.url;
                console.log(filename);
            });
        }
        req.body.picpath = filename;

        mysql.query("update orga_profile set organization=?,number=?,address=?,city=?,proof=?,picpath=?,Games=?,prev_tour=? where email=?",[req.body.txtorg,req.body.txtnumber,req.body.txtaddress,req.body.txtcity,req.body.selproof,req.body.picpath,req.body.selgame,req.body.txttour,req.body.txtmail],function(err){
            if(err==null)
                resp.send("Record Updated Successfully");
            else
                resp.send(err.message);
            })
    }
    catch(error){
        console.log(error);
    }

});
app.get("/fetch-profile",function(req,resp){
    let email = req.query.txtmail;
    console.log("Email received:", email);

    mysql.query("select * from orga_profile where email=?",[email],function(err,jsonArray)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       {
                resp.send(jsonArray);
                console.log("Query result:", jsonArray);

            }
    })
})


app.get("/fetch-profile2",function(req,resp){
    let email = req.query.txtmail;
    console.log("Email received:", email);

    mysql.query("select * from players where email=?",[email],function(err,jsonArray)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       {
                resp.send(jsonArray);
                console.log("Query result:", jsonArray);

            }
    })
})



app.get("/publish-tournament",function(req,resp){
    let path3 = __dirname+"/public/publish-tournament.html";
    resp.sendFile(path3);
})
app.post("/insert-tournaments",async function(req,resp){
    try{
   
   let filename = "";
   if(req.files==null) //pic didn'it uploaded
        {
            filename = nopic.jpg;
        }
    else
        {
            filename=req.files.posterpic.name;
            let path = __dirname+"/public/uploads/"+filename;
           // console.log(path);
           req.files.posterpic.mv(path);

            //saving file on cloudinary server

            await cloudinary.uploader.upload(path).then(function(result){
                filename = result.url;
                console.log(filename);
            });
        }
        req.body.picpath = filename;

        mysql.query("insert into tournaments value(?,?,?,?,?,?,?,?,?,?,?)",[null,req.body.txtmail,req.body.txttitle,req.body.txtgame,req.body.txtfee,req.body.txtdate,req.body.txtcity,req.body.txtloc,req.body.picpath,req.body.txtprizes,req.body.txtinfo],function(err){
            if(err==null)
                resp.send("Record Saved Successfully");
            else
                resp.send(err.message);
        })
    }
    catch(error){
        console.error(error);
        
    }
})

app.get("/fetch-all-tournaments",function(req,resp)
{
    let city = req.query.city;
    let game = req.query.game;
    mysql.query("select * from tournaments where city=? and game = ?",[city,game],function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
        resp.send(jsonArray);
    })
})

app.get("/fetch-game",function(req,resp){

    mysql.query("select distinct game from tournaments;",function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
        resp.send(jsonArray);
    })
})

app.get("/fetch-city",function(req,resp){

    mysql.query("select distinct city from tournaments;",function(err,jsonArray){
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
        resp.send(jsonArray);
    })
})


app.get("/profile-player",function(req,resp){
    let path = __dirname+"/public/profileplayer.html";
    resp.sendFile(path);
})

app.post("/save-player", async function (req, resp) {
    let filename = "";

    if (req.files == null) {
        filename = "nopic.jpg"; // Default picture
    } else {
        filename = req.files.playerpic.name;
        console.log(filename);
        let localPath = __dirname + "/public/uploads/" + filename;

        // Save file locally and upload to Cloudinary
        req.files.playerpic.mv(localPath);
        await cloudinary.uploader.upload(localPath).then(function (result) {
            filename = result.url;
        });
    }

    // Convert multi-select sports array to a string
   
   // const sports = Array.isArray(req.body.plsports) ? req.body.plsports.join(",") : req.body.plsports;

    // Prepare SQL query
    mysql.query(
        "INSERT INTO players (email, name, mobile, address, city, dob, gender, proof, picpath, sports, achievements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.txtplmail,
            req.body.txtname,
            req.body.plphn,
            req.body.pladdress,
            req.body.plcity,    
            req.body.dob,
            req.body.gender,
            req.body.plidproof,
            filename,
            req.body.plsports,
            req.body.acheivements,
        ],
        function (err) {
            if (err == null) {
                resp.send("Record saved successfully.");
            } else {
                resp.send(err.message);
            }
        }
    );
});

app.post("/update-player", async function (req, resp) {
    let filename = "";

    if (req.files == null) {
        filename = "nopic.jpg"; // Default picture
    } else {
        filename = req.files.playerpic.name;
        console.log(filename);
        let localPath = __dirname + "/public/uploads/" + filename;

        // Save file locally and upload to Cloudinary
        req.files.playerpic.mv(localPath);
        await cloudinary.uploader.upload(localPath).then(function (result) {
            filename = result.url;
        });
    }

  

    // Prepare SQL query
    mysql.query(
        "update players set name=?, mobile=?, address=?, city=?, dob=?, gender=?, proof=?, picpath=?, sports=?, achievements=? where email=?",
        [
           
            req.body.txtname,
            req.body.plphn,
            req.body.pladdress,
            req.body.plcity,    
            req.body.dob,
            req.body.gender,
            req.body.plidproof,
            filename,
            req.body.plsports,
            req.body.acheivements,
            req.body.txtplmail
        ],
        function (err) {
            if (err == null) {
                resp.send("Record Updated successfully.");
            } else {
                resp.send(err.message);
            }
        }
    );
});


app.get("/change-pwd",function(req,resp){
    
    mysql.query("update userss set Password=? where Email=? and Password=?",[req.query.newpwd,req.query.email,req.query.pwd],
        function(err){
            if(err==null){
                resp.send("Password Changed Successfully");
            }
            else{
                resp.send(err.message);
            }
        }
    )
});