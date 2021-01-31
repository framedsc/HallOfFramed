import React, { useCallback, useEffect, useState } from 'react';
import FramedModal from '../components/FramedModal/FramedModal';
import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';
import { ModalContext } from '../utils/ModalContext';

const ImageGridContainer = ({ data, setBgImage }) => {
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

  const [imageData, setImageData] = useState([]);
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [type, setType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewer, setShowViewer] = useState(false);
  const [viewerSrc, setViewerSrc] = useState({});
  const [isReverse, setIsReverse] = useState(false);
  const [modal, setModal] = useState({ show: false, component: null, className: '' });

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

  const handleClose = () => {
    setViewerSrc({});
    setShowViewer(false);
    setModal({ ...modal, component: null, show: false });
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
        results = results.filter((item) => item.width >= item.height);
      } else if (type === 'Portrait') {
        results = results.filter((item) => item.width <= item.height);
      }

      return searchData(results);
    },
    [isReverse, searchData, sortOption, type],
  );

  const selectPreviousImage = () => {
    const index = imageData.findIndex((e) => e.id === viewerSrc.id);
    if (index - 1 >= 0) {
      setViewerSrc(imageData[index - 1]);
    }
  };

  const selectNextImage = () => {
    const index = imageData.findIndex((e) => e.id === viewerSrc.id);
    if (index + 1 <= imageData.length) {
      setViewerSrc(imageData[index + 1]);
    }
  };

  useEffect(() => {
    if (data.length) {
      const images = filterImages(data.slice());

      setImageData(images);
    }
  }, [data, sortOption, type, searchTerm, isReverse, filterImages]);

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
            images={imageData}
            rowTargetHeight={400}
            container={container}
            onClick={handleImageClick}
            borderOffset={7}
          />
        )}
        <ImageViewer
          image={viewerSrc}
          show={showViewer}
          onClose={handleClose}
          data={imageData}
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
