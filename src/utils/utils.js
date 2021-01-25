import { useState, useEffect } from 'react';

function getWindowDimensions(container) {
  const maxWidth = container.clientWidth;
  
  return {
    maxWidth
  };
}

export default function useWindowDimensions(container) {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions(container));

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions(container));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}