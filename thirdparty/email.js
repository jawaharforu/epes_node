const nodemailer = require('nodemailer');

module.exports.sendEmail = function (email, subject, body) {
  return new Promise(resolve => {
    const transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'nationpulseweb@gmail.com',
          pass: '%$t2DFS6#k$',
      },
    });

    const mailOptions = {
      from: 'nationpulseweb@gmail.com',
      to: email,
      subject: subject,
      html: body,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          resolve(false);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      resolve(true);
    });

  });
};
