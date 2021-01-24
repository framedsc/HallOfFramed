const APIURL = 'https://raw.githubusercontent.com/originalnicodrgitbot/test-git-python/main/shotsdb.json';
const axios = require('axios');


export const getImages = () => axios.get(`${APIURL}`);