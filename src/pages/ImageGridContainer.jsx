import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import FramedModal from '../components/FramedModal/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import { ModalContext, SiteDataContext } from '../utils/context';
import { scrolledToBottom, useScrollPosition } from '../utils/utils';

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

const initialState = {
  images: [],
  sortOption: sortOptions[0],
  format: 'all',
  searchTerm: '',
  showViewer: false,
  viewerSrc: {},
  isReverse: false,
  waiting: false,
  page: 1,
};

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
      return { ...state, viewerSrc: {}, showViewer: false };
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

let timer;

const ImageGridContainer = ({ pageSize, setBgImage }) => {
  const [
    { images, sortOption, format, searchTerm, showViewer, viewerSrc, isReverse, waiting, page },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
  });

  const [modal, setModal] = useState({
    show: false,
    component: null,
    className: '',
    withClose: true,
  });
  const siteData = useContext(SiteDataContext);
  const { imageData } = siteData || [];
  const moreImagesToLoad = page * pageSize <= images.length;
  const isBottom = useScrollPosition(moreImagesToLoad);

  const checkLoadMore = () => {
    if (isBottom && !waiting) {
      loadMore();
    }
  };

  const handleClose = () => {
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

  const handleImageClick = (image) => {
    dispatch({ type: 'selectImage', image });
  };

  const searchData = useCallback(
    (data) => {
      if (searchTerm?.length < 3) {
        return data;
      }
      dispatch({ type: 'setPage', page: 1 });
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
      dispatch({ type: 'selectImage', image: images[index - 1] });
    }
  };

  const selectNextImage = () => {
    const index = images.findIndex((e) => e.id === viewerSrc.id);
    if (index + 1 <= images.length) {
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
    waiting,
  ]);

  moreImagesToLoad && checkLoadMore();

  return (
    <div style={{ margin: '0 auto' }} className="home">
      <ModalContext.Provider value={{ modal, setModal }}>
        <ImageNav
          className={showViewer || modal.show ? 'hidden' : ''}
          options={sortOptions}
          reverseSort={isReverse}
          updateSort={handleSortChange}
          updateFormat={handleFormatChange}
          updateSearch={handleSearchChange}
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
