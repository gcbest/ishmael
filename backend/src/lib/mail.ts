import { createTransport } from 'nodemailer';

export const transport = createTransport({
        host: process.env.MAIL_HOST as string,
        port: process.env.MAIL_PORT as string,
        auth: {
                user: process.env.MAIL_USER as string,
                pass: process.env.MAIL_PASS as string,
        },
});

export const makeANiceEmail = (text: string): string => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>

    <p>😘, Wes Bos</p>
  </div>
`;
