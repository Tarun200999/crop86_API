var nodemailer = require('nodemailer');
require("dotenv").config();
const sendgridTransporter=require("nodemailer-sendgrid-transport");

const transporter=nodemailer.createTransport(sendgridTransporter(
    {
        auth: {
            api_key:process.env.SENDGRID_API_KEY 
        }
    }
))
module.exports=transporter;
