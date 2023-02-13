const IMAGESAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/shotsdb.json';
const AUTHORSAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json';
const axios = require('axios');

const timestamp = (new Date()).getTime();
export const getImages = () => axios.get(`${IMAGESAPI}?timestamp=${timestamp}`);
export const getAuthors = () => axios.get(`${AUTHORSAPI}?timestamp=${timestamp}`);
