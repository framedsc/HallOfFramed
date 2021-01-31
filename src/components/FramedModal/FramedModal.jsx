import classNames from 'classnames';
import React from 'react';
import { Cancel } from '../../assets/svgIcons';

const FramedModal = ({show, className, component, onClose }) => {
  const visibleClass = show ? 'is-visible' : undefined;

  const handleClose = React.useCallback(() => {
    const isFullscreen = document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenElement;

    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      if (onClose) {
        onClose();
      }
    }
  }, [onClose]);

  return (
    <div className={classNames('framed-modal', className, visibleClass)} onClick={handleClose}>
      {component}
      <button className="close" onClick={handleClose}>
        <Cancel />
      </button>
    </div>
  );
};

export default FramedModal;
