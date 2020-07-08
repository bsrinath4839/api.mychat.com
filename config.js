dotenv = require('dotenv');
dotenv.config();

module.exports = {
    dburl: process.env.DB_CONNECT_URL,
    port: process.env.PORT,
    secret: process.env.SECRET,
    mymail: process.env.MY_MAIL,
    mymailpassword: process.env.MY_MAIL_PASSWORD,
};