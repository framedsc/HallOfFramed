import classNames from 'classnames';
import React, { useContext } from 'react';
import { Cancel } from '../../assets/svgIcons';
import { ModalContext } from '../../utils/context';

const FramedModal = ({show, className, component, onClose }) => {
  const visibleClass = show ? 'is-visible' : undefined;
  const { modal, setModal } = useContext(ModalContext);

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
      } else {
        setModal({ className:'', component: null, show: false });
      }
    }
  }, [onClose, setModal]);

  return (
    <div className={classNames('framed-modal', className, visibleClass)}>
      <div className="framed-modal-overlay" onClick={handleClose}>
        <div className="framed-modal-content" onClick={(event) => {event.stopPropagation();}}>
          {component}
        </div>
      </div>
      {modal.withClose && (
      <button className="close" onClick={handleClose}>
        <Cancel />
      </button>)}
    </div>
  );
};

export default FramedModal;