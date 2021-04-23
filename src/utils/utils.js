const baseSearchData = {
  minDate:new Date('2019-02-17'),
  maxDate:new Date(86400000 + +new Date()),
  numberHelpers: [
    { label: 'greater than', hint: '>=', operator: '>'},
    { label: 'less than', hint: '<=', operator: '<'},
    { label: 'equal to', hint: '=', operator: '='}
  ],
  searchOptions: [
    {
      label: 'author',
      property: 'author',
      hint: 'user name',
      type: 'string',
      helperText: ":",
      entries: [],
      helpers: true
    },
    {
      label: 'title',
      property: 'game',
      hint: 'game title',
      type: 'string',
      helperText: ":",
      entries: [],
      helpers:true
    },
    {
      label: 'on',
      property: 'epochtime',
      hint: 'specific date',
      helperText: ":",
      type: 'number',
      helpers:true, 
      range: []
    },
    {
      label: 'before',
      property: 'epochtime',
      hint: 'specific date',
      type: 'number',
      helperText: ":",
      operator: '<',
      helpers:false
    },
    {
      label: 'after',
      property: 'epochtime',
      hint: 'specific date',
      type: 'number',
      helperText: ":",
      operator: '>',
      helpers:false
    },
    {
      label: 'width',
      property: 'width',
      hint: 'pixels wide',
      helperText: ":",
      type: 'number',
      helpers:true,
      range: []
    },
    {
      label: 'height',
      property: 'height',
      hint: 'pixels tall',
      helperText: ":",
      type: 'number',
      helpers:true,
      range: []
    },
    {
      label: 'score',
      property: 'score',
      hint: 'number of reactions',
      helperText: ":",
      type: 'number',
      helpers:true, 
      range: []
    },
    {
      label: 'id',
      property: 'epochTime',
      hint: '',
      helperText: ":",
      type: 'number',
      helpers:true, 
      hide: true,
      range: []
    }
  ]
}

export const scrolledToBottom = (el, buffer) => {
  return (el.getBoundingClientRect().bottom - buffer) <= window.innerHeight;
}

export const breakpoints = {
  mobile: 820,
};

export const getBrowserFullscreenElementProp = () => {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement';
  } else if (typeof document.mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement';
  } else if (typeof document.msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement';
  } else if (typeof document.webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement';
  } else {
    throw new Error('fullscreenElement is not supported by this browser');
  }
}

export const extractTopLevelDomain = (url) => {
  if (!url.indexOf('//')) {
    return url;
  }
  const start = url.indexOf('//') + 2;
  const newURL = url.slice(start);
  if (newURL.indexOf('/') < 0) {
    return newURL;
  }
  const end = newURL.indexOf('/');

  return newURL.slice(0, end);
}

export const getQueryParam = (param) => {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  return params.get(param);
}

const getRange = (key, data) => {
  if (!data.length) {
    return [0,0];
  }
  const sortMethod = (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
  const sortedData = data.sort(sortMethod);
  return [sortedData[0][key], sortedData[data.length-1][key]];
}

export const generateSearchData = (data) => {
  const searchData = Object.assign(baseSearchData);
  const imageData = data.slice();
  const searchWithEntries = searchData.searchOptions.filter((item) => {
    return item.hasOwnProperty('entries')
  })

  // reset entries for some reason? shouldnt be necessary
  for (let searchOption of searchWithEntries) {
    searchOption.entries = [];
  }
 
  // populate entries for autocomplete
  for (let item of imageData) {
    for (let searchOption of searchWithEntries) {
      const property = searchOption.property;
      const entries = searchOption.entries;
      if (!entries.includes(item[property])) {
        entries.push(item[property])
      }
    }
  }
  
  // get min-max ranges
  for (let item of searchData.searchOptions) {
    if (item.hasOwnProperty('range')) {
      item.range=getRange(item.property, imageData);
    }
  }
  
  for (let item of searchWithEntries) {
    item.entries.sort();
  }

  return (searchData);
}

export const getSearchKey = (searchOption) => {
  const index = baseSearchData.searchOptions.findIndex(e => e.label === searchOption);
  const found = index > -1;
  return found ? baseSearchData.searchOptions[index].property : false;
}

export const getOperator = (searchOption) => {
  const index = baseSearchData.searchOptions.findIndex(e => e.label === searchOption);
  const searchItem = baseSearchData.searchOptions[index];
  return searchItem?.operator;
}

export const getSearchDataByType = (type) => {
  const itemsByType = baseSearchData.searchOptions.filter((item) => item.type === type);
  return itemsByType.map(item => item.property);
}
export function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i].epochtime === a[j].epochtime)
              a.splice(j--, 1);
      }
  }

  return a;
}