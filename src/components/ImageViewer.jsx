import React, { useReducer, useEffect } from 'react';
import classNames from 'classnames';
import Spinner from '../components/Spinner/Spinner';
import { Cancel, Fullscreen, ExitFullscreen } from '../assets/svgIcons';
import { useFullscreenStatus } from "../utils/utils";

const reducer = ( state, action) => {
    switch (action.type) {
        case "initialize": 
            return { ... state, initialized: true };
        case "close":
            return { initialized: false, loadedState: false };
        case "loadImage":
            return { initialized: true, loadedState: true };
        case "changeImage":
            return { ...state, loadedState: false}
        default:
            return state;
    }
}

const ImageViewer = ({image = {}, show, onClose, data, onPrev, onNext}) => {
    const [{ initialized, loadedState}, dispatch] = useReducer(reducer, {
        initialized: false,
        loadedState: false
    })

    const visibleClass = show ? 'is-visible' : undefined;

    const prevDisabled = data.findIndex((e) => e.id === image.id) === 0 || !loadedState;
    const nextDisabled = data.findIndex((e) => e.id === image.id) === data.length - 1 || !loadedState;

    const maximizableElement = React.useRef(null);
    let [isFullscreen, setIsFullscreen] = useFullscreenStatus(maximizableElement);
    
    const handleExitFullscreen = () => document.exitFullscreen();

    const handlePrev = React.useCallback((event) => {
        event?.stopPropagation();
        dispatch({ type: 'changeImage'});
        onPrev();
    }, [onPrev])

    const handleNext = React.useCallback((event) => {
        event.stopPropagation();
        dispatch({ type: 'changeImage'});
        onNext();
    }, [onNext])

    const handleClose = React.useCallback(() => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            dispatch({ type: 'close'});
            onClose();
        }
    }, [isFullscreen, onClose])

    const handleLoad = () => {
        dispatch({ type: 'loadImage'});
    }

    const handleKeyboard = React.useCallback((event) => {
        const { key } = event;

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
                if (isFullscreen) {
                    return false;
                }
              return handleClose()
            case 'f':
                return setIsFullscreen();
            default:
              return false;
          }
    }, [isFullscreen, handleClose, handleNext, handlePrev, nextDisabled, prevDisabled, setIsFullscreen])

    useEffect(() => {
        window.addEventListener("keyup", handleKeyboard);
        
        // remove listener when component unmounts
        return () => {
            window.removeEventListener("keyup", handleKeyboard);
        };
    }, [initialized, handleKeyboard]);

    const modifier = !initialized ? 'global' : '';
    const fullscreenClass = isFullscreen ? 'fullscreen' : false;

    return (
        <div className={classNames('image-viewer', visibleClass)} onClick={handleClose}> 
            <div className="image-nav">
                <button className="image-nav-button left" disabled={prevDisabled} onClick={handlePrev}>[ Prev ]</button>
                <button className="image-nav-button right" disabled={nextDisabled} onClick={handleNext}>[ Next ]</button>
            </div>

                <div ref={maximizableElement} className={classNames('image-viewer-content', fullscreenClass)}>
                    {image && (
                        <>
                            <img 
                                alt={image.gameName} 
                                src={image.shotUrl} 
                                onClick={(event) => {event.stopPropagation();}}
                                onLoad={handleLoad}
                            />
                            {initialized && !isFullscreen && (<div className="author" onClick={(event) => {event.stopPropagation();}}>
                                {/* <img src={image.authorsAvatarUrl} alt="avatar" /> */}
                                <div><span>by</span> <strong>{image.author}</strong></div>
                                <div className="title">{image.gameName}</div>
                                {!isFullscreen && (
                                    <button className="fullscreen-button" onClick={setIsFullscreen}><Fullscreen/></button>
                                )}
                            </div>)}
                            {isFullscreen ? (
                                <button className="close" onClick={handleExitFullscreen}><ExitFullscreen/></button>
                            ) : (
                                <button className="close" onClick={handleClose}><Cancel/></button>
                            )}
                        </>
                    )}
                    <Spinner modifier={modifier} show={!loadedState} />
                </div>
        </div>
    )
}

export default ImageViewer;