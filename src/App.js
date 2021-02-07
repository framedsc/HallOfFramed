import React, { useCallback, useEffect, useState } from 'react';
import ImageGridContainer from '../src/pages/ImageGridContainer';
import { SiteDataContext } from '../src/utils/context';
import { getAuthors, getImages } from './api/request';
import './assets/fonts/stylesheet.css';
import './components/Spinner/Spinner.css';
import './styles/App.css';
import './styles/reset.css';

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
  const [initialized, setInitialized] = useState(false);
  const [bgImageContainer, setBgImageContainer] = useState(null);

  const setBackground = useCallback(
    (imageObject) => {
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
      const authorName = normalizedAuthors.find((author) => author.authorid === normalizedImages[i].author)?.authorNick;
      if (authorName) {
        normalizedImages[i].authorName=authorName;
      }
    }

    setSiteData({imageData: normalizedImages, authorData: normalizedAuthors})

  };

  useEffect(() => {
    const { imageData } = siteData;

    !initialized && getData();
    imageData.length && !bgImageContainer && setBgImageContainer(document.querySelector('.bg-blur'));
    if (imageData.length && bgImageContainer) {
      const randomImageIndex = Math.floor(Math.random() * Math.floor(imageData.length-1));
      setBackground(imageData[randomImageIndex]);
    }
  }, [bgImageContainer, siteData, initialized, setBackground]);

  return (
    <div className="image-grid">
      {siteData.imageData && siteData.authorData && (
        <SiteDataContext.Provider value={siteData}>
          <ImageGridContainer setBgImage={setBackground} />
        </SiteDataContext.Provider>
      )}
    </div>
  );
}

export default App;
