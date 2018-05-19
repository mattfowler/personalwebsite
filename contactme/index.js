'use strict';

const ContactRequest = require('./ContactRequest.js');
const nodemailer = require('nodemailer');

const errorCallback = (callback, err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
        'Content-Type': 'application/json',
    },
});

const sendMessage = function (callback, event) {

    try {
        const contactRequest = ContactRequest.fromString(event.body);

        const smtpUser = process.env.SMTP_USER;
        const smtpPassword = process.env.SMTP_PASSWORD;

        let transporter = nodemailer.createTransport({
            host: 'email-smtp.us-east-1.amazonaws.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {user: smtpUser, pass: smtpPassword}
        });

        let mailOptions = {
            from: 'mailbot@mattfowler.io',
            replyTo: contactRequest.replyTo,
            to: 'matt.fow@gmail.com',
            subject: contactRequest.subject,
            text: contactRequest.message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return errorCallback(callback, new Error('Error sending message'));
            }
            console.log('Message sent: %s', info.messageId);
            return callback(null, {
                statusCode: '200',
                body: 'Your message has been sent',
                headers: {'Content-Type': 'application/json',}
            });
        });
    }
    catch (error) {
        console.error(error);
        errorCallback(callback, new Error('Bad Request'));
    }
};

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));

    switch (event.httpMethod) {
        case 'POST':
            sendMessage(callback, event);
            break;
        default:
            errorCallback(callback, new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
