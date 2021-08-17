require("dotenv").config();
const express = require("express");
const app = express();
const transporter=require("./nodemailer");
const cors = require("cors");

const fs=require("fs");
const upload = require("./multer/multer");
const corsOptions = {
    // origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({
  extended: true
}));


/*------------------------------*/

app.get("/",(req,res)=>{
    res.json({message:"Working"});
})

/*------------------------------*/

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
app.post('/sendmail', upload.array('photos'), async(req, res, next)=> {
      const {name,email,contact,description,colorCode}=req.body;

      if(!name||!email||!contact||!description||!colorCode)
      {
          return res.json({error:"All fields Required"});
      }
      if(!validateEmail(email))
      {
         return res.json({error:"Invalid Email Address"});
      }

      if(req.files==undefined)
      {
          return res.json({error:"Files are required"});
      }
      var attachment=[];
      for(var i=0;i<req.files.length;i++)
      {
            var filename=req.files[i].filename;
            const data=await fs.readFileSync(`uploads/${filename}`);
            const delFile=await fs.unlinkSync(`uploads/${filename}`);
            var obj={};
            obj.filename=filename;
            obj.content=data;
            attachment.push(obj);
      }
       var mailData= {
         to: email,
         from: process.env.SENDER_EMAIL_SENDGRID,
         subject: "Customer Enquiry",
         html:`<h4>Name : ${name}</h4</br><h4>Email : ${email}</h4></br><h4>Contact : ${contact}</h4></br><h4>Description : ${description}</h4></br><h4>Color Code : ${colorCode}</h4>`,
         attachments:attachment
        };
        transporter.sendMail(mailData,(err, info)=>{
            if(err)
            {
                console.log(err);
             return res.status(200).json({
                 success: false,
                 message: "Error in Sending Mail"
               }); 
            }
            mailData= {
                to: "tk2091999@gmail.com",
                from: process.env.SENDER_EMAIL_SENDGRID,
                subject: "Customer Enquiry",
                html:`<h4>Name :${name}</h4</br><h4>email :${email}</h4></br><h4>contact :${contact}</h4><br><h4>Description :${description}</h4></br></h4>Color Code :${colorCode}</h4>`,
                attachments:attachment
               };
               transporter.sendMail(mailData,(err, info)=>{
                if(err)
                {
                    console.log(err);
                 return res.status(200).json({
                     success: false,
                     message: "Error in Sending Mail"
                   }); 
                }
                return res.status(200).json({
                 success: true,
                 message: "Both Mail Send Succesfully"
               });
                });
         });
  })
/*------- APP STARTING   */   
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

