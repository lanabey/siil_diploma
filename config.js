const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.PORT,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_HOST: process.env.MAIL_HOST,
};
