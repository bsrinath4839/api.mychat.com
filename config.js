const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    dburl : process.env.DB_CONNECT_URL,
    port: process.env.PORT,
};