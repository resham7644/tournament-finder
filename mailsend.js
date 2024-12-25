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


sendMail("resham7644@gmail.com","Subject","Mesage");