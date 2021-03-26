import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from "react-router-dom";
import FramedModal from '../components/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import { ModalContext, SiteDataContext } from '../utils/context';
import { useScrollPosition } from '../utils/hooks';
import { getOperator, getSearchDataByType, getSearchKey, scrolledToBottom } from '../utils/utils';
//import { getQueryParam, scrolledToBottom } from '../utils/utils';

const sortOptions = [
  {
    label: 'Date',
    key: 'epochtime',
  },
  {
    label: 'Popularity',
    key: 'score',
  },
];

let timer;

const ImageGridContainer = ({ pageSize, setBgImage, imageId }) => {
  //const searchQuery = getQueryParam('search');

  // component state
  const initialState = {
    images: [],
    sortOption: sortOptions[0],
    format: 'all',
    searchText: '',
    filters: [],
    showViewer: false,
    viewerSrc: null,
    isReverse: false,
    waiting: false,
    page: 1,
  };

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
  const siteData = useContext(SiteDataContext);

  // component variables
  const { imageData, searchData } = siteData;

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

  const checkLoadMore = () => {
    if (isBottom && !waiting) {
      loadMore();
    }
  };

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
    window.scrollTo({ top: 0 });
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
    dispatch({ type: 'setSearchFilters', filters:uniqueFilters });
  };

  const updateImageParam = (id) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    params.delete("imageId");
    if (id) {
      params.append("imageId", id)
    } 
    history.push({search: params.toString()})
  }

  const handleImageClick = (image) => {
    updateImageParam(image.epochtime);

    dispatch({ type: 'selectImage', image });
  };

  const parseNumberTerm = (type, term) => {
    let termToParse = term.indexOf('<') !== -1
    ? term.substr(term.indexOf('<') + 1)
    : term.substr(term.indexOf('>') + 1);

    if (type === 'epochtime') {
      termToParse = +new Date(termToParse)/1000;
    }
    
    return parseInt(termToParse, 10);
  }

  const applyFilter = useCallback((filter, dataToSearch) => {
    const filterText = filter.trimStart();
    if (filterText?.length < 3) {
      return dataToSearch;
    }
    const delimiterIndex = filterText.indexOf(':');
    let searchOption = filterText.substring(0, delimiterIndex).toLowerCase();
    let newSearchTerm = filterText.substring(delimiterIndex + 1).replace(/\s+/g, '');;

    // ugly logic, will fix later
    const searchKeyResult = getSearchKey(searchOption);
    const newSearchOption = searchKeyResult ? searchKeyResult : searchOption;

    if (searchOptions.strings.includes(newSearchOption)) {
      return dataToSearch.filter((imageData) => {
        // if more than 1 char, search for the tag after lowercasing and removing spaces, else return data (nothing)
        return newSearchTerm?.length >= 3
          ? imageData[newSearchOption].replace(/\s+/g, '').toLowerCase().includes(newSearchTerm.toLowerCase())
          : dataToSearch;
      });
    } else if (searchOptions.numbers.includes(newSearchOption)) {
      const operator = getOperator(searchOption);
      let parsedNumberTerm = parseNumberTerm(newSearchOption, newSearchTerm);

      return dataToSearch.filter((obj) => {
        return operator === '<' || newSearchTerm.indexOf('<') > -1
            ? obj[newSearchOption] <= parsedNumberTerm
            : obj[newSearchOption] >= parsedNumberTerm
      });
    } 
    // simple text search
    return dataToSearch.filter((imageData) => {
      return Object.keys(imageData).reduce((acc, curr) => {
        return acc || imageData[curr].toString().toLowerCase().includes(filterText.toLowerCase());
      }, false);
    });
  }, [searchOptions])

  const search = useCallback((data) => {
    let results = data.slice();

    for (const filter of filters) {
      results = applyFilter(filter, results)
    }

    return results;
  }, [applyFilter, filters]);

  const loadMore = () => {
    if (scrolledToBottom(document.body, 50)) {
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

  const filterImages = useCallback(
    (images) => {
      let results = images;
      const key = sortOption.key;

      let sortMethod = (a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0);
      if (isReverse) {
        sortMethod = (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
      }
      results = images.sort(sortMethod);

      if (format === 'Wide') {
        results = results.filter((item) => item.width > item.height);
      } else if (format === 'Portrait') {
        results = results.filter((item) => item.width <= item.height);
      }
      return filters.length ? search(results) : results;
    },
    [isReverse, search, sortOption, format, filters.length],
  );

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

  const noSearchResults = () => {
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

  return (
    <div className="home">
      <ModalContext.Provider value={{ modal, setModal }}>
        <ImageNav
          className={showViewer || modal.show ? 'hidden' : ''}
          options={sortOptions}
          reverseSort={isReverse}
          updateSort={handleSortChange}
          updateFormat={handleFormatChange}
          onLogoClick={()=> dispatch({type:'reset'})}
          searchProps={{
            searchData,
            updateSearch: handleSearchChange,
            updateFilters: handleFilterChange,
            searchText,
            filters
          }}
        />
        {imageData && (
          <ImageGrid
            className="image-rows"
            images={images}
            rowTargetHeight={400}
            onClick={handleImageClick}
            borderOffset={7}
          />
        )}
        {noSearchResults()}
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
