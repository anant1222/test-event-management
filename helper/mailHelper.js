const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
require("dotenv").config();
const _ = require("lodash");

// Create a transporter using SMTP
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.MAIL_SENDER_ID,
        pass: process.env.MAIL_SENDER_PASSWORD,
    },
});

// Define the email options
function mailOptions(recipientEmail, mail_type,emailData) {
    let templatePath;
    if (mail_type === process.env.MAIL_TYPE_RESULT) {
        templatePath = pathToFileURL("public/resultEmailTemplate.html");
        emailData = emailData ? emailData : resultEmailData;
    } else {
        templatePath = pathToFileURL("public/questionPaperEmailTemplate.html");
        emailData = emailData ? emailData : inviteEmailData;
    }
    return {
        from: `${process.env.APP_NAME} <${process.env.MAIL_SENDER_ID}>`,
        to: `${recipientEmail}`,
        subject: `Mail from ${process.env.APP_NAME}`,
        html: generateEmailHTML(templatePath, emailData),
    };
}

function generateEmailHTML(templatePath, data) {
    // Read the HTML template
    let html = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual data
    for (let key in data) {
        let regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, data[key]);
    }

    return html;
}

// Usage example
const resultEmailData = {
    userFirstName: "John",
    testName: "JavaScript Proficiency Test",
    websiteName: "CodeMaster",
    userScore: "85/100",
    correctCount: "10",
    totalAttempt: "15",
    resultStatus: "Pass",
    websiteUrl: "https://codemaster.com",
};

const inviteEmailData = {
    userFirstName: "John",
    websiteName: "CodeMaster",
    testName: "JavaScript Proficiency Test",
    duration: "60 mins",
    questions: "15",
    websiteUrl: "https://codemaster.com",
};

// Send the email
async function sendMail(recipientEmail, mail_type, emailData) {
    try {
        if (_.isEmpty(recipientEmail)) {
            console.log("Please enter a valid email address");
        } else {
            let info = await transporter.sendMail(mailOptions(recipientEmail,mail_type,emailData));
            console.log("Message sent: %s", info.messageId);
        }
    } catch (error) {
        console.error("Error occurred in sendMail function:::::", error);
        throw new error();
    }
}

module.exports = {
    sendMail,
};
