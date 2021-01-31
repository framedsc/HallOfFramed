import React, { useCallback, useEffect, useState } from 'react';
import ImageGridContainer from '../src/pages/ImageGridContainer';
import { getImages } from './api/request';
import './components/Spinner/Spinner.css';
import './styles/App.css';
import './styles/reset.css';

function App() {
  const [data, setData] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [bgImageContainer, setBgImageContainer] = useState(null);

  const setBackground = useCallback(
    (imageObject) => {
      const bgImage = imageObject.thumbnailUrl;
      bgImageContainer.style.backgroundImage = `url('${bgImage}')`;
    },
    [bgImageContainer],
  );

  const getNewImages = async () => {
    setInitialized(true);
    const response = await getImages({});
    const entries = Object.entries(response.data._default);
    const shots = [];

    entries.forEach((item) => {
      const id = item[0];
      const shotData = item[1];
      shots.push({ id, ...shotData });
    });

    setData(shots);
  };

  useEffect(() => {
    !initialized && getNewImages();
    data.length && !bgImageContainer && setBgImageContainer(document.querySelector('.bg-blur'));
    if (data.length && bgImageContainer) {
      const randomImageIndex = Math.floor(Math.random() * Math.floor(data.length-1));
      setBackground(data[randomImageIndex]);
    }
  }, [bgImageContainer, data, initialized, setBackground]);

  return (
    <div className="image-grid">
      {data && <ImageGridContainer data={data} setBgImage={setBackground} />}
    </div>
  );
}

export default App;
