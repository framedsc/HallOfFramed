import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from "react-router-dom";
import FramedModal from '../components/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import ProfileBanner from '../components/ProfileBanner'
import { ModalContext, SiteDataContext } from '../utils/context';
import { useScrollPosition } from '../utils/hooks';
import {
  arrayUnique,
  getOperator,
  getSearchDataByType,
  getSearchKey,
  updateQueryParam
} from '../utils/utils';

const sortOptions = [
  {
    label: 'Date',
    key: 'epochtime',
  },
  {
    label: 'Shuffle',
    key: 'random',
  },
  {
    label: 'AR',
    key: 'aspectRatio'
  }
];

let timer;

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return { 
        ...state, 
        sortOption:sortOptions[0], 
        format: 'all',
        filters: [],
        searchText: '',
        showViewer: false,
        viewerSrc: null,
        isReverse: false,
        page: 1
      };
    case 'loadMoreImages':
      return { ...state, waiting: true, page: action.page };
    case 'doneWaiting':
      return { ...state, waiting: false };
    case 'setPage':
      return { ...state, waiting: true, page: action.page };
    case 'changeFormat':
      return { ...state, page: 1, waiting: true, ...action };
    case 'close':
      return { ...state, viewerSrc: null, showViewer: false };
    case 'setSearchData':
      return {...state, searchData: action.data};
    case 'setSearchText':
        return { ...state, searchText: action.text };  
    case 'setSearchFilters':
      return { ...state, filters: action.filters };
    case 'setImages':
      return { ...state, images: action.images };
    case 'selectImage':
      return { ...state, viewerSrc: action.image, showViewer: true };
    case 'loadImage':
      return { initialized: true, loadedState: true, showImage: true };
    case 'changeSort':
      return {
        ...state,
        page: 1,
        waiting: true,
        sortOption: action.sortOption,
        isReverse: action.isReverse,
      };
    default:
      return state;
  }
};

function getProfileName(queryParams) {
  const filteredAuthors = queryParams.filter(item => item.startsWith("author: "));
  if (filteredAuthors.length !== 1) {
    return "";
  }
  return filteredAuthors[0].slice(8);
}

const ImageGridContainer = ({ pageSize, setBgImage, imageId, queryParams, onShuffle, searchData }) => {
  //const searchQuery = getQueryParam('search');
  const { siteData } = useContext(SiteDataContext);
  const { imageData } = siteData;
  const { authorData } = siteData;
  const [profileData, setProfileData] = useState(authorData.find((item) => getProfileName(queryParams) === item.authorNick));

  // component state
  const initialState = {
    images: [],
    sortOption: sortOptions[0],
    format: 'all',
    searchText: '',
    filters: queryParams,
    showViewer: false,
    viewerSrc: null,
    isReverse: false,
    waiting: false,
    page: 1,
  };

  const [
    { images, sortOption, format, filters, searchText, showViewer, viewerSrc, isReverse, waiting, page },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
  });

  // context
  const [modal, setModal] = useState({
    show: false,
    component: null,
    className: '',
    withClose: true,
  });
  // component variables

  const moreImagesToLoad = page * pageSize <= images.length;
  const isBottom = useScrollPosition(moreImagesToLoad);
  const history = useHistory();
  const searchOptions = React.useMemo(()=>{
    return {
      strings : getSearchDataByType('string'),
      numbers : getSearchDataByType('number')
    }
  }, []);

  // component methods
  const loadImageFromQueryString = useCallback(() => {
    const imageIndex = imageData.findIndex((e) => e.epochtime === imageId);
    const image = imageData[imageIndex];
    dispatch({type: 'selectImage', image, showViewer: true})
  }, [imageData, imageId]);

  const updateImageParam = (id) => {
    const searchQuery = window.location.search;
    const params = new URLSearchParams(searchQuery);
    params.delete("imageId");
    if (id) {
      params.append("imageId", id)
    } 
    history.push({search: params.toString()})
  }

  const checkLoadMore = () => {
    if (isBottom && !waiting) {
      dispatch({ type: 'loadMoreImages', page: page + 1 });
    }
  };

  const paginate = useCallback(
    (filteredImages) => {
      const totalImagesToLoad = pageSize * page;
      if (totalImagesToLoad > filteredImages.length) {
        return filteredImages;
      } else {
        return filteredImages.slice(0, totalImagesToLoad);
      }
    },
    [page, pageSize],
  );

  const handleClose = () => {
    updateImageParam();

    if (modal.className !== 'author-social-content') {
      dispatch({ type: 'close' });
    }
    setModal({ ...modal, className: '', component: null, show: false });
  };

  const handleSortChange = (option) => {
    if (option.key === sortOption.key) {
      dispatch({ type: 'changeSort', isReverse: !isReverse, sortOption });
    } else {
      dispatch({ type: 'changeSort', isReverse: false, sortOption: option });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (option.key ==='random') {
      onShuffle();
    }
  };

  const handleFormatChange = (format) => {
    dispatch({ type: 'changeFormat', format });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (text) => {
    dispatch({ type: 'setSearchText', text });
  };

  const handleFilterChange = (newFilters) => {
    const filterFunc = (item, pos) => newFilters.indexOf(item) === pos;
    const uniqueFilters = newFilters.filter(filterFunc);
    updateQueryParam(uniqueFilters, history);
    setProfileData(authorData.find((item) => getProfileName(uniqueFilters) === item.authorNick));
    dispatch({ type: 'setSearchFilters', filters:uniqueFilters });
  };

  const handleImageClick = (image) => {
    updateImageParam(image.epochtime);

    dispatch({ type: 'selectImage', image });
  };

  const buildFilters = useCallback((filterArray) => {
    const filterObjects = [];
    for (const filter of filterArray) {
      const searchOption = getFilterOption(filter);
      const searchKey = getSearchKey(searchOption);
      if (!searchKey) {
        filterObjects.push({searchTerm: filter})
      } else {
        const filterOptionIndex = filterObjects.findIndex(e => e.searchOption === searchOption);
        //if (filterOptionIndex > -1 && searchOptions.strings.includes(searchKey)) {
        if (filterOptionIndex > -1) {
          filterObjects[filterOptionIndex].searchTerms.push(getFilterTerm(filter));
        } else {
          filterObjects.push({
            searchOption,
            searchTerms: [getFilterTerm(filter)]
          })
        }
      }
    }
    return filterObjects;
  }, [])

  const applyFilter = useCallback((filter, dataToSearch) => {
    if (filter.hasOwnProperty('searchOption')) {
      let searchOption = filter.searchOption;
      const searchTerms = filter.searchTerms;
      let results = [];

      const searchKeyResult = getSearchKey(searchOption);
      const newSearchOption = searchKeyResult ? searchKeyResult : searchOption;

      for (const term of searchTerms) {
        const newSearchTerm = term.replace(/\s+/g, '');
        let newResults = [];
        if (searchOptions.strings.includes(newSearchOption)) {
          newResults = dataToSearch.filter((imageData) => {
            // if more than 1 char, search for the tag after lowercasing and removing spaces, else return data (nothing)
            return newSearchTerm?.length >= 3
              ? imageData[newSearchOption].replace(/\s+/g, '').toLowerCase().includes(newSearchTerm.toLowerCase())
              : dataToSearch;
          });
        } else if (searchOption === 'on') {
          const dateEpoch = parseNumberTerm(newSearchOption, newSearchTerm);
          let dateValue = new Date(dateEpoch*1000);
          dateValue.setDate(dateValue.getDate()+1);
          const nextDate = Date.parse(dateValue)/1000;
          
          newResults = dataToSearch.filter((obj) => {
            return obj[newSearchOption] >= dateEpoch && obj[newSearchOption] <= nextDate;
          });

          console.log('dateEpoch', dateEpoch)
          console.log('dateValue', dateValue)
          console.log('newResults', newResults)
        } else if (searchOptions.numbers.includes(newSearchOption)) {
          const operator = getOperator(searchOption);
          const parsedNumberTerm = parseNumberTerm(newSearchOption, newSearchTerm);
    
          newResults = dataToSearch.filter((obj) => {
            if (operator === '=' || newSearchTerm.indexOf('=') > -1) {
              return obj[newSearchOption] === parsedNumberTerm;
            }
            return operator === '<' || newSearchTerm.indexOf('<') > -1
                ? obj[newSearchOption] <= parsedNumberTerm
                : obj[newSearchOption] >= parsedNumberTerm
          });
        } 
        results = arrayUnique(results.concat(newResults));
        //results = results.concat(newResults);
      } 
      return results;
    } 
    const filterText = filter.searchTerm;
    if (filterText.length < 3) {
      return dataToSearch;
    }

    return dataToSearch.filter((imageData) => {
      return Object.keys(imageData).reduce((acc, curr) => {
        return acc || imageData[curr].toString().toLowerCase().includes(filterText.toLowerCase());
      }, false);
    });
  }, [searchOptions]);

  const search = useCallback((data) => {
    let results = data.slice();
    const filterObjects = buildFilters(filters);

    for (const filter of filterObjects) {
      results = applyFilter(filter, results)
    }

    return results;
  }, [applyFilter, filters, buildFilters]);

  const filterImages = useCallback(
    (images) => {
      let results = images;
      const key = sortOption.key;

      if (format === 'Wide') {
        results = results.filter((item) => item.width > item.height);
      } else if (format === 'Portrait') {
        results = results.filter((item) => item.width <= item.height);
      }

      let filteredResults = filters.length ? search(results) : results;

      if (sortOption.key !== 'random') {
        let sortMethod = (a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0);
        if (isReverse) {
          sortMethod = (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
        }
        filteredResults = filteredResults.sort(sortMethod);
      }
      console.log(filteredResults)

      //dispatch({type: 'setSearchData', data: generateSearchData(imageData)});
    
      return filteredResults;
    },
    [isReverse, search, sortOption, format, filters.length],
  );

  const parseNumberTerm = (type, term) => {
    let termToParse;

    if (term.indexOf('<') !== -1) {
      termToParse = term.substr(term.indexOf('<') + 1);
    } else if (term.indexOf('>') !== -1) {
      termToParse = term.substr(term.indexOf('>') + 1);
    } else {
      termToParse = term.substr(term.indexOf('=') + 1);
    }

    if (type === 'epochtime') {
      const dateValue = new Date(termToParse);
      termToParse = Date.parse(dateValue)/1000;
    }
    
    return parseInt(termToParse, 10);
  }

  const getFilterOption = (text) => {
    const delimiterIndex = text.indexOf(':');
    if (delimiterIndex === -1) {
      return false;
    }
    return text.substring(0, delimiterIndex);
  }

  const getFilterTerm = (text) => {
    const delimiterIndex = text.indexOf(':');
    if (delimiterIndex === -1) {
      return false;
    }
    return text.substring(delimiterIndex + 1).trimStart();
  }

  const selectPreviousImage = () => {
    const index = images.findIndex((e) => e.epochtime === viewerSrc.epochtime);
    if (index - 1 >= 0) {
      updateImageParam(images[index - 1].epochtime);
      dispatch({ type: 'selectImage', image: images[index - 1] });
    }
  };

  const selectNextImage = () => {
    const index = images.findIndex((e) => e.epochtime === viewerSrc.epochtime);
    if (index + 1 <= images.length) {
      updateImageParam(images[index + 1].epochtime);
      dispatch({ type: 'selectImage', image: images[index + 1] });
    }
  };

  const renderNoSearchResults = () => {
    return filters.length > 0 && !images.length ? (
      <div className="no-search-results">There are no images matching your search criteria</div>
    ) : null;
  };

  useEffect(() => {
    if (imageData.length) {
      const filteredImages = filterImages(imageData.slice());

      const paginatedImages = paginate(filteredImages);

      dispatch({ type: 'setImages', images: paginatedImages });
    }

    if (waiting) {
      clearTimeout(timer);
      timer = setTimeout(() => dispatch({ type: 'doneWaiting' }), 2000);
    }
  }, [
    imageData,
    sortOption,
    format,
    isReverse,
    filterImages,
    showViewer,
    paginate,
    waiting
  ]);

  useEffect(() => {
    if (imageData.length && imageId !== null) {
      loadImageFromQueryString();
    }
  }, [imageData, imageId, loadImageFromQueryString]);

  moreImagesToLoad && checkLoadMore();

  const handleLogoClick = () => {
    dispatch({type: 'reset'})
    updateQueryParam([], history);
    setProfileData(undefined);
  };

  return (
    <div className="home">
      <ModalContext.Provider value={{ modal, setModal }}>
        <ImageNav
          className={showViewer || modal.show ? 'hidden' : ''}
          options={sortOptions}
          reverseSort={isReverse}
          updateSort={handleSortChange}
          updateFormat={handleFormatChange}
          onLogoClick={handleLogoClick}
          searchProps={{
            searchData,
            updateSearch: handleSearchChange,
            updateFilters: handleFilterChange,
            searchText,
            filters
          }}
        />
        <ProfileBanner
          profileData={profileData}
        />
        {imageData && (
          <ImageGrid
            className="image-rows"
            images={images}
            rowTargetHeight={400}
            onClick={handleImageClick}
            borderOffset={7}
            profileMode={profileData !== undefined}
          />
        )}
        {moreImagesToLoad && (
          <div className="load-more-container">
            <button 
              onClick={() => dispatch({ type: 'loadMoreImages', page: page + 1 })}
              tabIndex={-1}
            >
              Load more images
            </button>
          </div>
        )}
        {renderNoSearchResults()}
        <ImageViewer
          image={viewerSrc}
          show={showViewer}
          onClose={handleClose}
          data={images}
          onPrev={selectPreviousImage}
          onNext={selectNextImage}
          setBgImage={setBgImage}
        />
        <FramedModal
          onClose={handleClose}
          className={modal.className}
          show={modal.show}
          component={modal.component}
        />
      </ModalContext.Provider>
    </div>
  );
};
export default React.memo(ImageGridContainer);
