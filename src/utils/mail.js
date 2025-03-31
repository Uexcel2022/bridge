import nodeMailer from 'nodemailer'

export const sendMail = async (option) => {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const emailOptions = {
      from: "i-tour <support@itour.io>",
      to: option.email,
      subject: option.subject,
      text: option.message,
    };
  
    await transporter.sendMail(emailOptions);
  };
