import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import config from '../config/email';
import path from 'path';


const transporter = nodemailer.createTransport(config);

transporter.use('compile', hbs({
  viewEngine: {
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/'),
    defaultLayout: undefined,
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
}));

module.exports = transporter;
