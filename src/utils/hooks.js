import { useEffect, useLayoutEffect, useState } from 'react';
import { getBrowserFullscreenElementProp, scrolledToBottom } from './utils';

export const useViewport = () => {
  const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const [width, setWidth] = useState(actualWidth);

  const onWindowLoad = () => {
    const actualWidth = document.documentElement.clientWidth || document.body.clientWidth;
    setWidth(actualWidth);
  }

  useEffect(() => {
    let resizeTimeout;
    window.setTimeout(onWindowLoad, 1000);
    const handleWindowResize = () => {
      const windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => setWidth(windowWidth), 50);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Return the width so we can use it in our components
  return { width };
};

export const useScrollPosition = (moreImageToLoad) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const wrappedElement = document.body;
      if (moreImageToLoad) {
        setIsBottom(scrolledToBottom(wrappedElement, 100));
      }
    };
    window.addEventListener('scroll', onScroll, false);
    return () => window.removeEventListener('scroll', onScroll, false);
  }, [moreImageToLoad]);

  // Return the width so we can use it in our components
  return moreImageToLoad ? isBottom : false;
};

export const useOutsideAlerter = (ref, onClickOutside) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export const useFullscreenStatus = (elRef) => {
  const [isFullscreen, setIsFullscreen] = useState(
    document[getBrowserFullscreenElementProp()] != null,
  );

  const setFullscreen = () => {
    if (elRef.current == null) return;

    elRef.current
      .requestFullscreen()
      .then(() => {
        setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
      })
      .catch(() => {
        setIsFullscreen(false);
      });
  };

  useLayoutEffect(() => {
    document.onfullscreenchange = () =>
      setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);

    return () => (document.onfullscreenchange = undefined);
  });

  return [isFullscreen, setFullscreen];
};