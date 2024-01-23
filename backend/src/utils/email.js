import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendWelcomeMail = (email, user)=>{
    console.log(process.env.EMAIL, process.env.PASSWORD)

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Registeration Successful',
        text: `Hello, ${user}! you have successfully registered on Authentication Example app.`
    }

    transport.sendMail(message, (error, info)=>{
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }
        console.log('Message sent successfully.')
    })
}