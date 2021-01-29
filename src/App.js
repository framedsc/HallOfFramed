import './styles/App.css';
import './components/Spinner/Spinner.css';
import React, { useState, useEffect, useCallback } from 'react';
import { getImages } from './api/request'
import ImageGridContainer from '../src/pages/ImageGridContainer'

function App() {
  const [data, setData] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [bgImageContainer, setBgImageContainer] = useState(null);

  const setBackground = useCallback((imageObject) => {
    const bgImage = imageObject.thumbnailUrl;
    bgImageContainer.style.backgroundImage = `url('${bgImage}')`;
  }, [bgImageContainer])

  const getNewImages = async () => {
    setInitialized(true);
    const response = await getImages({});
    const entries = Object.entries(response.data._default);
    const shots = [];
    
    entries.forEach((item) => 
    { 
        const id = item[0];
        const shotData = item[1];
        shots.push({ id, ...shotData });
    });

    setData(shots);
  }

  useEffect(() => {
      !initialized && getNewImages();
      data.length && !bgImageContainer && setBgImageContainer(document.querySelector('.bg-blur'));
      data.length && bgImageContainer && setBackground(data[0]);
      
  }, [bgImageContainer, data, initialized, setBackground])

  return (
    <div className="image-grid">
      {data && (<ImageGridContainer data={data} setBgImage={setBackground}/>)}
    </div>
  );
}

export default App;
