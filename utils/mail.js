require('dotenv').config();
const AWS = require('aws-sdk');
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const REGION = process.env.REGION;
const EMAIL = process.env.EMAIL;


exports.sendSignupMail = (mail) => {

    const SES_CONFIG = {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: REGION 
    }

    const params = {
        Source: EMAIL,
        Destination: {
            ToAddresses: [
                mail
            ]
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: 'Hi there,<br> Thank you for signing up.<br> <strong> Explore different courses and keep learning. </strong><br><br> Thank you'
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Signup successfully.'
            }
        }
    }
    new AWS.SES(SES_CONFIG).sendEmail(params).promise()
    .then((result) => {
        console.log(`Mail send successfully ${ result }.`);
    }).catch((err) => {
        console.log(`Error while sending email. ${ err }`);
    });
};
