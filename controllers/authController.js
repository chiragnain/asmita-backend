// authentication logic
// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const TempUser = require('../models/TempUser');

// Create a transporter object
const transporter = nodemailer.createTransport({
   service: process.env.MailHost,
   port: process.env.MailPort,
   secure: false, // use SSL
   auth: {
     user: process.env.MailUser,
     pass: process.env.MailPass,
   }
 });

// Registration with email confirmation
exports.register = async (req, res) => {
   try {
       const { email, password, full_name, role } = req.body;
       // Check if user already exists
       const existingUser = await User.findOne({ email });
       if (existingUser) return res.status(400).json({ message: 'Email already registered' });

       // Generate hashed password
       const hashedPassword = await bcrypt.hash(password, 10);
       
       // Generate unique token for email verification
       const verificationToken = crypto.randomBytes(32).toString('hex');
       const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
       
       // if already sent mail once, expire the previous token
       const existingTempUser=await TempUser.findOne({email});
       if(existingTempUser)await TempUser.deleteOne({ _id: existingTempUser._id });

       // Save temporary user with verification token
       const tempUser = new TempUser({ email, password: hashedPassword, full_name, role, verificationToken, tokenExpiry });
       await tempUser.save();

       // Send confirmation email
       const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email/${verificationToken}`;
       // Configure the mailoptions object
       const mailOptions = {
            from: process.env.MailFrom, // sender address
            to: email, // receiver's email address
            subject: 'Please confirm your email',
            text: `Click on this link to confirm your email: ${confirmationLink}`,
            html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`
       };
       try {
            await transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                 console.log('Error:', error);
               } else {
                 console.log('Email sent: ' + info.response);
               }
             });
       } catch (mailError) {
            // Delete temp user
            await TempUser.deleteOne({ _id: tempUser._id });
            console.error("Error sending email:", mailError);
            return res.status(500).json({ message: 'Failed to send confirmation email.' });
       }
     
       res.status(200).json({ message: 'Confirmation email sent. Please check your inbox.' });

   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

// confirm email
exports.confirmEmail = async (req, res) => {
   try {
       const { token } = req.params;

       // Find the temp user by token and check expiry
       const tempUser = await TempUser.findOne({ verificationToken: token });

       if (!tempUser) {
           return res.status(400).json({ message: 'Invalid token' });
       }

       if (tempUser.tokenExpiry < Date.now()) {
           await TempUser.deleteOne({ _id: tempUser._id }); // Clean up expired token
           return res.status(400).json({ message: 'Token Expired' });
       }

       // Move user from TempUser to User
       const newUser = new User({
           email: tempUser.email,
           password: tempUser.password,
           full_name: tempUser.full_name,
           role: tempUser.role,
       });
       await newUser.save();

       // Delete temp user after successful save
       await TempUser.deleteOne({ _id: tempUser._id });

       res.status(200).json({ message: 'Email confirmed! You can now log in.' });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};


// login user
exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id, email: user.email, name: user.full_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
      res.json({ token });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};
