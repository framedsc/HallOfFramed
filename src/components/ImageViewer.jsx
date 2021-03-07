import classNames from 'classnames';
import React, { useContext, useEffect, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Cancel, ExitFullscreen, Fullscreen, NextArrow } from '../assets/svgIcons';
import SocialLinks from '../components/SocialLinks';
import Spinner from '../components/Spinner/Spinner';
import { ModalContext, SiteDataContext } from '../utils/context';
import { useFullscreenStatus } from '../utils/utils';

const initialState = {
  initialized: false, 
  loadedState: false, 
  showImage: false, 
  authorExpanded: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return { ...state, initialized: true };
    case 'close':
      return { ...initialState };
    case 'loadImage':
      return { initialized: true, loadedState: true, showImage: true };
    case 'changeImage':
      return { ...state, loadedState: false };
    case 'showGlobalSpinner':
      return { ...state, initialized: false, showImage: false };
    case 'expandSocials':
      return { ...state, authorExpanded: true };
    case 'closeSocials':
      return { ...state, authorExpanded: false };
    default:
      return state;
  }
};

const ImageViewer = ({ image = {}, show, onClose, data, onPrev, onNext, setBgImage }) => {
  const [{ authorExpanded, initialized, loadedState, showImage }, dispatch] = useReducer(reducer, {
    authorExpanded: false,
    initialized: false,
    loadedState: false,
    showImage: false,
  });

  const { modal } = useContext(ModalContext);
  const siteData = useContext(SiteDataContext);
  const { authorData } = siteData;

  let isFullscreen, setIsFullscreen;
  const imageViewerContent = React.useRef(null);
  let fullScreenError;
  try {
    [isFullscreen, setIsFullscreen] = useFullscreenStatus(imageViewerContent);
  } catch (e) {
    fullScreenError = 'Fullscreen not supported';
    isFullscreen = false;
    setIsFullscreen = undefined;
  }

  const visibleClass = show ? 'is-visible' : undefined;
  const prevDisabled = data.findIndex((e) => e.id === image?.id) === 0 || !loadedState;
  const nextDisabled = data.findIndex((e) => e.id === image?.id) === data.length - 1 || !loadedState;

  const modifier = !initialized ? 'global' : '';
  const fullscreenClass = isFullscreen ? 'fullscreen' : undefined;
  const blurClass = modal.show ? 'blur' : undefined;
  const loadedClass = showImage ? 'loaded' : 'hidden';
  const viewerClass = modal.show ? 'hidden' : 'visible';
  const socialData = image && authorData.find((item) => image.author === item.authorNick);

  const handleExitFullscreen = () => document.exitFullscreen();

  const handlePrev = React.useCallback(
    (event) => {
      event?.stopPropagation();
      dispatch({ type: 'changeImage' });
      onPrev();
    },
    [onPrev],
  );

  const handleNext = React.useCallback(
    (event) => {
      event?.stopPropagation();
      dispatch({ type: 'changeImage' });
      onNext();
    },
    [onNext],
  );

  const handleClose = React.useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      dispatch({ type: 'close' });
      onClose();
    }
  }, [isFullscreen, onClose]);

  const handleLoad = () => {
    dispatch({ type: 'loadImage' });
    setBgImage(image);
  };

  const handleKeyboard = React.useCallback(
    (event) => {
      const { key } = event;

      if (!show) {
        return false;
      }

      switch (key) {
        case 'ArrowRight':
          if (nextDisabled) {
            return false;
          }
          return handleNext(event);
        case 'ArrowLeft':
          if (prevDisabled) {
            return false;
          }
          return handlePrev(event);
        case 'Escape':
          if (isFullscreen || modal.show) {
            return false;
          }
          return handleClose();
        case 'f':
          if (fullScreenError) {
            return false;
          }
          return setIsFullscreen();
        default:
          return false;
      }
    },
    [
      modal,
      isFullscreen,
      handleClose,
      handleNext,
      handlePrev,
      nextDisabled,
      prevDisabled,
      setIsFullscreen,
      fullScreenError,
      show,
    ],
  );

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboard);

    // remove listener when component unmounts
    return () => {
      window.removeEventListener('keyup', handleKeyboard);
    };
  }, [initialized, handleKeyboard]);

  const swipeConfig = {
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextDisabled) {
        return false;
      }
      dispatch({ type: 'showGlobalSpinner' });
      return handleNext();
    },
    onSwipedRight: () => {
      if (prevDisabled) {
        return false;
      }
      dispatch({ type: 'showGlobalSpinner' });
      return handlePrev();
    },
    onSwiping: (event) => {
      if ((event.dir === 'Right' && !prevDisabled) || (event.dir === 'Left' && !nextDisabled)) {
        imageViewerContent.current.style.left = `${event.deltaX}px`;
      } else {
        imageViewerContent.current.style.left = '0px';
      }
    },
    onSwiped: () => {
      imageViewerContent.current.style.left = '0px';
    },
    ...swipeConfig,
  });

  return (
    <div className={classNames('image-viewer', 'framed-modal', visibleClass)} onClick={handleClose}>
      <div className={classNames('viewer-nav', viewerClass)}>
        <button className="viewer-nav-button left" disabled={prevDisabled} onClick={handlePrev}>
          <NextArrow />
        </button>
        <button className="viewer-nav-button right" disabled={nextDisabled} onClick={handleNext}>
          <NextArrow />
        </button>
      </div>
      <div
        ref={imageViewerContent}
        className={classNames('image-viewer-content', fullscreenClass, blurClass)}
      >
        {image && (
          <>
            <img
              alt={image.game}
              src={image.shotUrl}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onLoad={handleLoad}
              className={loadedClass}
              {...handlers}
            />
            {initialized && !isFullscreen && (
              <div
                className={authorExpanded ? 'shot-info expanded' : 'shot-info'}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div
                  className='info clickable'
                  onClick={
                    !authorExpanded
                      ? () => dispatch({ type: 'expandSocials' })
                      : () => dispatch({ type: 'closeSocials' })
                  }
                >
                  <span className="by">{`by `}</span>
                  <span className="author">{image.author}</span>
                  <span className="title">{image.game}</span>
                  <SocialLinks data={socialData} />
                </div>
                <div className="image-viewer-controls">
                  {!isFullscreen && !fullScreenError && (
                    <button className="fullscreen-button" onClick={setIsFullscreen}>
                      <Fullscreen />
                    </button>
                  )}
                </div>
              </div>
            )}
            {isFullscreen ? (
              <button className="close" onClick={handleExitFullscreen}>
                <ExitFullscreen />
              </button>
            ) : (
              <button className="close" onClick={handleClose}>
                <Cancel />
              </button>
            )}
          </>
        )}
        <Spinner modifier={modifier} show={!loadedState} />
      </div>
    </div>
  );
};

export default ImageViewer;
