
 const sgMail = require('@sendgrid/mail');
const { DEFAULT_FROM_EMAIL } = require("../constants");

 sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sender = ({ to, subject, message }) => {
 
    return sgMail.send({
      to,
      from: DEFAULT_FROM_EMAIL,
      replyTo: process.env.MAIL_REPLYTO,
      subject,
      text: message,
    })

};

module.exports = {
  sender,
};
