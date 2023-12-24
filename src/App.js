import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ImageGridContainer from '../src/pages/ImageGridContainer';
import { addProperties, normalizeData } from '../src/utils/utils';
import { SiteDataContext } from '../src/utils/context';
import { getAuthors, getImages } from './api/request';
import './assets/fonts/stylesheet.css';
import './styles/AboutModalContent.css';
import './styles/AdvancedSearch.css';
import './styles/App.css';
import './styles/FramedModalContent.css';
import './styles/reset.css';
import './styles/Spinner.css';
import { generateSearchData, getQueryParam, shuffle } from './utils/utils';

function App() {
  const [siteData, setSiteData] = useState({ imageData: [], authorData: [] });
  const contextProvider = useMemo( ()=> ({siteData, setSiteData}), [siteData, setSiteData]);
  const [initialized, setInitialized] = useState(false);
  const [bgImageContainer, setBgImageContainer] = useState(null);

  function queryParams() {
    const author = getQueryParam('author');
    const title = getQueryParam('title');
    const on = getQueryParam('on');
    const before = getQueryParam('before');
    const after = getQueryParam('after');
    const score = getQueryParam('score');
    const width = getQueryParam('width');
    const height = getQueryParam('height');
    const color = getQueryParam('color');
    
    function formatQueryParam(filter, queryParam) {
      if (queryParam.length === 0) return [];
      return queryParam.map(entry => `${filter}: ${entry}`)
    }

    return [
      formatQueryParam("author", author),
      formatQueryParam("title", title),
      formatQueryParam("on", on),
      formatQueryParam("before", before),
      formatQueryParam("after", after),
      formatQueryParam("score", score),
      formatQueryParam("width", width),
      formatQueryParam("height", height),
      formatQueryParam("color", color),
    ].flat();
  }

  // get image ID from URL if there is one
  const imageIdParam = getQueryParam('imageId');
  const imageId = imageIdParam.length === 0 ? null : parseInt(imageIdParam[0]);

  const setBackground = useCallback((imageObject) => {
      if (!imageObject) {
        return;
      }
      const bgImage = imageObject.thumbnailUrl;
      bgImageContainer.style.backgroundImage = `url('${bgImage}')`;
    },
    [bgImageContainer],
  );

  const getData = async () => {
    setInitialized(true);
    const imagesResponse = await getImages({});
    const authorsResponse = await getAuthors({});
    const normalizedImages = normalizeData(imagesResponse.data._default);
    const normalizedAuthors = normalizeData(authorsResponse.data._default);
    const formattedImages = addProperties(normalizedImages, normalizedAuthors);

    setSiteData({ imageData: formattedImages, authorData: normalizedAuthors});
  };

  const shuffleImages = () => {
    const { imageData } = siteData; 
    const preShuffledImages = imageData.slice();
    const shuffledImages = shuffle(preShuffledImages);
    setSiteData({ ...siteData, imageData: shuffledImages});
  }

  useEffect(() => {
    const { imageData } = siteData;

    !initialized && getData();

    // get element for applying the blurry background image
    !bgImageContainer && setBgImageContainer(document.querySelector('.bg-blur'));

    // apply random image to background image container
    if (imageData.length && bgImageContainer) {
      const imageIndex = imageId
        ? imageData.findIndex((e) => e.epochtime === imageId)
        : Math.floor(Math.random() * Math.floor(imageData.length - 1));
      setBackground(imageData[imageIndex]);
    }
  }, [bgImageContainer, siteData, initialized, setBackground, imageId]);

  const dataAvailable = siteData.imageData.length > 0 && siteData.authorData.length;

  return (
    <div className="image-grid">
      {dataAvailable && (
        <SiteDataContext.Provider value={contextProvider}>
          <ImageGridContainer 
            imageId={imageId} 
            queryParams={queryParams()}
            pageSize={100} 
            setBgImage={setBackground} 
            searchData={generateSearchData(siteData.imageData)}
            onShuffle={shuffleImages}
          />
        </SiteDataContext.Provider>
      )}
    </div>
  );
}

export default App;
