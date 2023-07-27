const express = require("express");
const router = express.Router()
const path = require('path')
const multer = require('multer')
const File = require('../models/file')
const { v4: uuidv4 } = require("uuid");

// require("dotenv").config();

let storage = multer.diskStorage({
    destination:(req,file,callback)=>callback(null,'uploads/'),
    filename:(req,file,callback)=>{
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        callback(null, uniqueName);
    }

})


let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");





router.post('/',(req,res)=>{
    // store file
    upload(req,res,async(err)=>{
        // validate req
        if(!req.file){
            return res.status(500).json({error:"All fields are required"})
        }
        if(err){
            return res.status(500).send({ error: err.message });
        }

        // store in db
         const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      
    })


})

router.post('/send',async(req,res)=>{
     const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  console.log(uuid,emailTo,emailFrom)
  // Get data from db 
  // try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    let path =  `${process.env.APP_BASE_URL}/files/download/${uuid}`;
    console.log(path)
    // send mail
    const transporter = require("../services/mailService");
    const mailOptions = {
      from: "jimadams2233@gmail.com",
      to: emailTo,
      subject: "Hey, You have received a file!",
      text: `You have received a document from ${file.sender}. You can download it using ${process.env.APP_BASE_URL}/files/${uuid}. Thank You for using Inshare`,
      attachments: [
        {
          filename: file.filename,
          path: path,
        },
      ],
    };
    transporter.sendMail(mailOptions,function(err,info){
      if(err){
        console.log(err);
      }
      else{
        console.log("Mail sent Successfully");
      }
    })
    return res.send({success:true})
// } catch(err) {
//   return res.status(500).send({ error: 'Something went wrong.'});
// }

});




module.exports=router