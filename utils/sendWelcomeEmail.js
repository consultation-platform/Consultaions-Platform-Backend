const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const sendWelcomeEmail = async (options) => {
  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.API_KEY;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  await tranEmailApi
    .sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      params: {
        user: options.user,
        message: options.message,
        semester: options.semester,
        week: options.week,
        day: options.day,
      },
      htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
      
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              .logo {
                  text-align: center;
                  margin-bottom: 20px;
              }
      
              .logo img {
                  max-width: 150px;
                  height: auto;
              }
      
              .content {
                  text-align: center;
              }
      
              .verification-code {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
      
              .note {
                  color: #888;
                  margin-bottom: 20px;
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://s3-eu-west-1.amazonaws.com/moyasar.api.assets.prod/entities/logos/35f/d3a/77-/original/data?1714399627" alt="Logo">
              </div>
              <div class="content">
                  <h1>Welcome {{params.user}}</h1>
                  <h2>Welcome {{params.message}}</h2>
                  <h3> {{params.semester}}</h3>
                  <h3> {{params.week}}</h3>
                  <h3> {{params.day}}</h3>
                   <p >Thank you.</p>
                  <p >The Sayees Team.</p>

               </div>
          </div>
      </body>
      
      </html>
                `,
    })
    .then(console.log("Email sent successfully"))
    .catch(console.log);
};

module.exports = sendWelcomeEmail;
