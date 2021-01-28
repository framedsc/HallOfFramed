import './styles/App.css';
import './components/Spinner/Spinner.css';
import React, { useState, useEffect } from 'react';
import { getImages } from './api/request'
import ImageGridContainer from '../src/pages/ImageGridContainer'

function App() {
  const [data, setData] = useState([]);
  const [initialized, setInitialized] = useState(false);

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
      if (!initialized) {
          getNewImages();
      }
  })

  return (
    <div className="image-grid">
      {data && (<ImageGridContainer data={data}/>)}
    </div>
  );
}

export default App;
