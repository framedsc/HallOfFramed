import React, { useReducer, useEffect } from 'react';
import classNames from 'classnames';
import Spinner from '../components/Spinner/Spinner';

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

    const handlePrev = (event) => {
        event?.stopPropagation();
        dispatch({ type: 'changeImage'});
        onPrev();
    }

    const handleNext = (event) => {
        event?.stopPropagation();
        dispatch({ type: 'changeImage'});
        onNext();
    }

    const handleClose = () => {
        dispatch({ type: 'close'});
        onClose();
    }

    const handleLoad = () => {
        dispatch({ type: 'loadImage'});
    }

    const handleKeyboard = (event) => {
        const { key } = event;

        if (loadedState){ 
            if (key === 'ArrowRight' && !nextDisabled) {
                return handleNext();
            } else if (key === 'ArrowLeft' && !prevDisabled) {
                return handlePrev();
            } 
        }

        return false;
    }

    useEffect(() => {
        window.addEventListener("keyup", handleKeyboard);
        
        // remove listener when component unmounts
        return () => {
            window.removeEventListener("keyup", handleKeyboard);
        };
    }, [initialized]);

    const modifier = !initialized ? 'global' : '';

    return (
        <div className={classNames('image-viewer', visibleClass)} onClick={handleClose}> 
            <div className="image-nav">
                <button className="image-nav-button left" disabled={prevDisabled} onClick={handlePrev}>[ Prev ]</button>
                <button className="image-nav-button right" disabled={nextDisabled} onClick={handleNext}>[ Next ]</button>
            </div>
            <div className="image-viewer-content">
                {image && (
                    <>
                        <img 
                            alt={image.gameName} 
                            src={image.shotUrl} 
                            onClick={(event) => {event.stopPropagation();}}
                            onLoad={handleLoad}
                        />
                        {initialized && (<div className="author" onClick={(event) => {event.stopPropagation();}}>
                            {/* <img src={image.authorsAvatarUrl} alt="avatar" /> */}
                            <div><span>by</span> <strong>{image.author}</strong></div>
                            <div className="title">{image.gameName}</div>
                        </div>)}
                    </>
                )}
                <Spinner modifier={modifier} show={!loadedState} />
                <button className="close" onClick={handleClose}></button>
            </div>
        </div>
    )
}

export default ImageViewer;