var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jimadams2233@gmail.com",
    pass: "ecxfbpnlylntuaur",
  },
});

module.exports = transporter;