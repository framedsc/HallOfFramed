import React, { useCallback, useContext, useEffect, useState } from 'react';
import FramedModal from '../components/FramedModal/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import { ModalContext, SiteDataContext } from '../utils/context';

const ImageGridContainer = ({ setBgImage }) => {
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

  const [images, setImages] = useState([]);
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [type, setType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const [viewerSrc, setViewerSrc] = useState({});
  const [isReverse, setIsReverse] = useState(false);
  const [modal, setModal] = useState({ show: false, component: null, className: '', withClose: true });
  const siteData = useContext(SiteDataContext);
  const { imageData } = siteData || [];

  const handleClose = () => {
    if (modal.className !== 'author-social-content') {
      setViewerSrc({});
      setShowViewer(false);
    }
    setModal({ ...modal, className:'', component: null, show: false });
  };

  const handleSortChange = (option) => {
    if (option.key === sortOption.key) {
      setIsReverse((current) => !current);
    } else {
      setIsReverse(false);
      setSortOption(option);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (type) => {
    setType(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (keyword) => {
    setSearchTerm(keyword);
  };

  const handleImageClick = (image) => {
    setViewerSrc(image);
    setShowViewer(true);
  };

  const searchData = useCallback(
    (data) => {
      if (searchTerm?.length < 3) {
        return data;
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

  const filterImages = useCallback(
    (images) => {
      let results = images;
      const key = sortOption.key;

      let sortMethod = (a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0);
      if (isReverse) {
        sortMethod = (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
      }
      results = images.sort(sortMethod);

      if (type === 'Wide') {
        results = results.filter((item) => item.width > item.height);
      } else if (type === 'Portrait') {
        results = results.filter((item) => item.width <= item.height);
      }

      return searchData(results);
    },
    [isReverse, searchData, sortOption, type],
  );

  const selectPreviousImage = () => {
    const index = images.findIndex((e) => e.id === viewerSrc.id);
    if (index - 1 >= 0) {
      setViewerSrc(images[index - 1]);
    }
  };

  const selectNextImage = () => {
    const index = images.findIndex((e) => e.id === viewerSrc.id);
    if (index + 1 <= images.length) {
      setViewerSrc(images[index + 1]);
    }
  };

  const noSearchResults = () => {
    return searchTerm.length > 3 && !images.length ? (
      <div className="no-search-results">There are no images matching your search criteria</div>
    ) : null;
  };

  useEffect(() => {
    if (imageData.length) {
      const filteredImages = filterImages(imageData.slice());

      setImages(filteredImages);
    }
  }, [imageData, sortOption, type, searchTerm, isReverse, filterImages, showViewer]);

  const container = document.querySelector('.image-grid');

  return (
    <div style={{ margin: '0 auto' }} className="home">
      <ModalContext.Provider value={{ modal, setModal }}>
        <ImageNav
          className={showViewer || modal.show ? 'hidden' : ''}
          options={sortOptions}
          reverseSort={isReverse}
          updateSort={handleSortChange}
          updateType={handleTypeChange}
          updateSearch={handleSearchChange}
        />
        {imageData && container && (
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
