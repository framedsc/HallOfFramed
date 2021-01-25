const APIURL = 'https://raw.githubusercontent.com/originalnicodrgitbot/hall-of-framed-db/main/shotsdb.json';
const axios = require('axios');


export const getImages = () => axios.get(`${APIURL}`);