//  // 1
// const twilio = require("twilio");

// module.exports = {
//   // 2
//   sendWhatsappMessage({ to, body }) {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     // 3
//     const client = new twilio(accountSid, authToken);

//     // 4
//     client.messages
//       .create({
//         from: "whatsapp:+14155238886",
//         body: body,
//         to: `whatsapp:${to}`,
//       })
//       .then((message) => console.log(message.sid))
//       .catch((err) => console.error(err));
//   },
// };

import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
  const token = <string>process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  const { phone, message } = req.body;
  // console.log(phone, message);
  client.messages
    .create({
      body: message,
      from: 'YOUR_PHONE_NUMBER',
      to: phone,
    })
    .then((message) =>
      res.json({
        success: true,
      })
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}