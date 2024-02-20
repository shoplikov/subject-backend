const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shoplikoval@gmail.com',
    pass: process.env.GMAIL_PASSWORD // Access password from environment variable
  }
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/send', (req, res) => {
  const { to, subject, text } = req.body;

  // Function to send email
  const mailOptions = {
    from: 'shoplikoval@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.error('Error occurred:', error);
      res.send('Error occurred, email not sent.');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully!');
    }
  });
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
