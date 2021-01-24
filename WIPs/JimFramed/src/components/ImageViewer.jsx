import React, {useState} from 'react';
import classNames from 'classnames';

const ImageViewer = ({image = {}, show, onClose}) => {

    const visibleClass = show ? 'is-visible' : undefined;

    return (
        <div className={classNames('image-viewer', visibleClass)} onClick={onClose}> 
            <div className="image-viewer-content">
                {image && (
                    <>
                        <img src={image.shotUrl} onClick={(event) => {event.stopPropagation();}}/>
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