import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useHistory } from "react-router-dom";
import FramedModal from '../components/FramedModal/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import { ModalContext, SiteDataContext } from '../utils/context';
import { getQueryParam, scrolledToBottom, useScrollPosition } from '../utils/utils';

const sortOptions = [
  {
    label: 'Date',
    key: 'date',
  },
  {
    label: 'Popularity',
    key: 'score',
  },
];

let timer;

const ImageGridContainer = ({ pageSize, setBgImage, imageId }) => {
  const searchQuery = getQueryParam('search');

  // component state
  const reducer = (state, action) => {
    switch (action.type) {
      case 'reset':
        return { ...initialState };
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
      case 'setSearchTerm':
        return { ...state, searchTerm: action.searchTerm };
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
  
  const initialState = {
    images: [],
    sortOption: sortOptions[0],
    format: 'all',
    searchTerm: searchQuery || '',
    showViewer: false,
    viewerSrc: null,
    isReverse: false,
    waiting: false,
    page: 1,
  };

  const [
    { images, sortOption, format, searchTerm, showViewer, viewerSrc, isReverse, waiting, page },
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
  const { imageData } = siteData || [];
  const moreImagesToLoad = page * pageSize <= images.length;
  const isBottom = useScrollPosition(moreImagesToLoad);
  const history = useHistory();

  // component methods
  const loadImageFromQueryString = useCallback(() => {
    const imageIndex = imageData.findIndex((e) => e.id === imageId);
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

  const handleSearchChange = (keyword) => {
    dispatch({ type: 'setSearchTerm', searchTerm: keyword });
  };

  const updateImageParam = (id) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (id) {
      params.append("imageId", id)
    } else {
      params.delete("imageId")
    }
    history.push({search: params.toString()})

  }

  const handleImageClick = (image) => {
    updateImageParam(image.id);

    dispatch({ type: 'selectImage', image });
  };

  const searchData = useCallback((data) => {
      const searchOptionStrings = ['author', 'game'];
      const searchOptionNumbers = ['height', 'score', 'width'];

      if (searchTerm?.length < 3) {
        return data;
      }
      dispatch({ type: 'setPage', page: 1 });

      let searchOption = searchTerm.substring(0, searchTerm.indexOf(':')).toLowerCase();
      let newSearchTerm = searchTerm.substring(searchTerm.indexOf(':') + 1).replace(/\s+/g, '');

      if (searchOptionStrings.includes(searchOption)) {
        const results = data.filter((obj) => {
          // if more than 1 char, search for the tag after lowercasing and removing spaces, else return data (nothing)
          return newSearchTerm?.length >= 3
            ? obj[searchOption]
                .toLowerCase()
                .replace(/\s+/g, '')
                .indexOf(newSearchTerm.toLowerCase()) !== -1
            : data;
        });
        return results;
      } else if (searchOptionNumbers.includes(searchOption)) {
        const results = data.filter((obj) => {
          // i may have been a little crazy here
          return newSearchTerm?.length >= 3
            ? /* if there is a '<', search for all item lower than the searched number, else it search for item upper, '>' or not */
              newSearchTerm.indexOf('<') !== -1
              ? obj[searchOption] <=
                parseInt(newSearchTerm.substr(newSearchTerm.indexOf('<') + 1), 10)
              : obj[searchOption] >=
                parseInt(newSearchTerm.substr(newSearchTerm.indexOf('>') + 1), 10)
            : data;
        });
        return results;
      }

      const results = data.filter((obj) => {
        return Object.keys(obj).reduce((acc, curr) => {
          return acc || obj[curr].toString().toLowerCase().includes(searchTerm.toLowerCase());
        }, false);
      });

      return results;
    },
    [searchTerm],
  );

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

      return searchData(results);
    },
    [isReverse, searchData, sortOption, format],
  );

  const selectPreviousImage = () => {
    const index = images.findIndex((e) => e.id === viewerSrc.id);
    if (index - 1 >= 0) {
      updateImageParam(images[index - 1].id);
      dispatch({ type: 'selectImage', image: images[index - 1] });
    }
  };

  const selectNextImage = () => {
    const index = images.findIndex((e) => e.id === viewerSrc.id);
    if (index + 1 <= images.length) {
      updateImageParam(images[index + 1].id);
      dispatch({ type: 'selectImage', image: images[index + 1] });
    }
  };

  const noSearchResults = () => {
    return searchTerm.length >= 3 && !images.length ? (
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
    searchTerm,
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
          updateSearch={handleSearchChange}
          defaultSearch={searchQuery}
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
export default ImageGridContainer;
