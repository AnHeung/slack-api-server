require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});

const isProd = process.env.NODE_ENV === 'prod';
const relativePath = isProd ? '../..' : '..';

exports.apiPath = ['./routes/slacks.js']
