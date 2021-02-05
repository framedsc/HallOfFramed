const IMAGESAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/shotsdb.json';
const AUTHORSAPI = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/authorsdb.json';
const axios = require('axios');

export const getImages = () => axios.get(`${IMAGESAPI}`);
export const getAuthors = () => axios.get(`${AUTHORSAPI}`);