import React from 'react';
import classNames from 'classnames';

const ImageViewer = ({image = {}, show, onClose, data, onPrev, onNext}) => {

    const visibleClass = show ? 'is-visible' : undefined;

    const prevDisabled = data.findIndex((e) => e.id === image.id) <= 0 ? true : false;
    const nextDisabled = data.findIndex((e) => e.id === image.id) >= data.length ? true : false;

    return (
        <div className={classNames('image-viewer', visibleClass)} onClick={onClose}> 
            <div className="image-nav">
                <button className="image-nav-button left" disabled={prevDisabled} onClick={onPrev}>[ Prev ]</button>
                <button className="image-nav-button right" disabled={nextDisabled} onClick={onNext}>[ Next ]</button>
            </div>
            <div className="image-viewer-content">
                {image && (
                    <>
                        <img alt={image.gameName} src={image.shotUrl} onClick={(event) => {event.stopPropagation();}}/>
                        <div className="author" onClick={(event) => {event.stopPropagation();}}>
                            {/* <img src={image.authorsAvatarUrl} alt="avatar" /> */}
                            <div><span>by</span> <strong>{image.author}</strong></div>
                            <div className="title">{image.gameName}</div>
                        </div>
                    </>
                )}
                <button className="close" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default ImageViewer;