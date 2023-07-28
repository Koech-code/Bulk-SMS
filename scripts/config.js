var Sequelize = require('sequelize');


// // Read ENV variables from .env file to process.env
// // NOTE: An alternative to doing this require directlty in code is to use the '-r dotenv/config' flag when you run the app in cmd
require('dotenv').config();


const winston = require('winston') // importing library
const format = winston.format // initialising for configuring log format options
const dateObj = new Date();
var currDate = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1) + '-' + dateObj.getUTCDay();

const consoleTransport = new winston.transports.Console(); // initialising console transport - for redirecting log output to console
// const errorLogsFileTransport = new winston.transports.File({ filename: 'error.log', level: 'error' }); // initialising file transport for error logs
const allLogsFileTransport = new winston.transports.File({
    // filename: 'application-'+ new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+'.log',
    filename: 'application-' + currDate + '.log',
    // filename: 'application-.log',
    dirname: './logs/',
    level: 'info',
    handleExceptions: true,
    colorize: true,
    json: false,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
}); // initialising file transport for all logs

const myWinstonOptions = { // defining configuration options for logger
    format: format.combine( // combining multiple format options
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // for adding timestamp to log
        }),
        format.label({ label: 'Event Log 🏷' }), // for labelling log message
        format.prettyPrint(), // for pretty printing log output
    ),

    transports: [consoleTransport, allLogsFileTransport] // transport objects to be used
}

module.exports = {
    secret: process.env.HASH_SECRET,
    port: process.env.PORT,
    // sequelize: new Sequelize('mysql://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+dbname),
    sequelize: new Sequelize(
        process.env.DATABASE,
        process.env.DB_USER,
        process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }),
    logger: new winston.createLogger(myWinstonOptions), // initialising logger
};