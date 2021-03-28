import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ImageGridContainer from '../src/pages/ImageGridContainer';
import { SiteDataContext } from '../src/utils/context';
import { getAuthors, getImages } from './api/request';
import './assets/fonts/stylesheet.css';
import './styles/AboutModalContent.css';
import './styles/AdvancedSearch.css';
import './styles/App.css';
import './styles/FramedModalContent.css';
import './styles/reset.css';
import './styles/Spinner.css';
import { generateSearchData, getQueryParam } from './utils/utils';

function normalizeData(data) {
  let noramlizedData = [];

  const entries = Object.entries(data._default);

  entries.forEach((item) => {
    const id = item[0];
    let attributes = item[1];
    noramlizedData.push({ id, ...attributes });
  });

  return noramlizedData;
}

function App() {
  const [siteData, setSiteData] = useState({ imageData: [], authorData: [] });
  const contextProvider = useMemo( ()=> ({siteData, setSiteData}), [siteData, setSiteData]);
  const [initialized, setInitialized] = useState(false);
  const [bgImageContainer, setBgImageContainer] = useState(null);

  const imageIdParam = getQueryParam('imageId');
  const imageId = imageIdParam && parseInt(imageIdParam);

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
    const normalizedImages = normalizeData(imagesResponse.data);
    const normalizedAuthors = normalizeData(authorsResponse.data);

    for (let i = 0; i < normalizedImages.length; i++) {
      normalizedImages[i].authorid = normalizedImages[i].author;
      const authorName = normalizedAuthors.find(
        (author) => author.authorid === normalizedImages[i].authorid,
      ).authorNick;
      normalizedImages[i].author = authorName;
      normalizedImages[i].game = normalizedImages[i].gameName;
      normalizedImages[i].epochtime = normalizedImages[i].epochTime;
    }

    setSiteData({ imageData: normalizedImages, authorData: normalizedAuthors});
  };

  useEffect(() => {
    const { imageData } = siteData;

    !initialized && getData();

    imageData.length && !bgImageContainer && setBgImageContainer(document.querySelector('.bg-blur'));
    if (imageData.length && bgImageContainer) {
      const randomImageIndex = imageId
        ? imageData.findIndex((e) => e.epochtime === imageId)
        : Math.floor(Math.random() * Math.floor(imageData.length - 1));
      setBackground(imageData[randomImageIndex]);
    }
  }, [bgImageContainer, siteData, initialized, setBackground, imageId]);

  return (
    <div className="image-grid">
      {siteData.imageData.length > 0 && 
      siteData.authorData.length > 0 && (
        <SiteDataContext.Provider value={contextProvider}>
          <ImageGridContainer 
            imageId={imageId} 
            pageSize={200} 
            setBgImage={setBackground} 
            searchData={generateSearchData(siteData.imageData)}
          />
        </SiteDataContext.Provider>
      )}
    </div>
  );
}

export default App;
