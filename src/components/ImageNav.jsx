import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import framedBanner from '../assets/framed_intro_pino.jpg';
import { About, FramedIcon, Menu, SortDown, SortUp } from '../assets/svgIcons';
import { ModalContext } from '../utils/ModalContext';
import { breakpoints, useOutsideAlerter, useViewport } from '../utils/utils';

const ImageNav = ({ className, options, reverseSort, updateSort, updateType, updateSearch }) => {
  const [active, setActive] = useState(options[0]);
  const [type, setType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { setModal } = useContext(ModalContext);

  const handleOptionChange = (selection) => {
    setActive(selection);
    updateSort(selection);
  };

  const handleTypeChange = (value) => {
    setType(value);
    updateType(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    updateSearch(event.target.value.toLowerCase());
  };

  const showAbout = () => {
    const modalComponent = (
      <div className="about-modal-content">
        <img alt="Welcome to Framed" src={framedBanner}></img>
        <h2>About the Hall of Framed</h2>
        <p>
          The Framed Screenshot Community Discord server is full of so many amazing screenshots
          that we quickly ran out of pins with which to showcase them. So we created a Discord bot
          that would automatically post the most popular screenshots (the ones that exceed a
          certain number of reactions) to a special channel. A list of those images is updated
          instantly when a new one gets posted, and that list gets uploaded so that we can display
          them on this here web site.
        </p>
        <p>
          We hope that this can serve as a showcase for what talented screenshotters can achieve.
          Maybe you'll find it useful as inspiration, or as a nice source of background images for
          your PC or phone.
        </p>
        <p>
          The Image Viewer can be controlled with the keyboard. Arrow keys will switch to the
          previous or next image. F will open an image in fullscreen. Escape will close fullscreen
          or close the image viewer. You can also swipe on mobile to change images.
        </p>
      </div>
    );

    setModal({ show: true, component: modalComponent, className: 'about-window' });
  };

  const types = ['All', 'Wide', 'Portrait'];
  const icon = reverseSort ? <SortUp /> : <SortDown />;

  const renderSearch = (
    <div className="search">
      <input
        type="search"
        name="search"
        className="search-input"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
      />
    </div>
  );

  const renderSort = (
    <ul className="filters">
      {options.map((item, index) => {
        const isActive = active.key === item.key;
        const buttonClass = isActive ? 'is-active' : undefined;

        return (
          <li key={index}>
            <button
              id={item.label}
              className={classNames('filter', buttonClass)}
              onClick={() => handleOptionChange(item)}
              key={item.label}
            >
              {item.label}
              {isActive && icon}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const renderFilters = (
    <div className="image-types">
      {types.map((item) => {
        return (
          <>
            <input
              id={`${item}-label`}
              onChange={() => handleTypeChange(item)}
              checked={type === item}
              type="radio"
              value={item}
              name="type"
              key={`${item}-input`}
            />
            <label key={`${item}-label`} htmlFor={`${item}-label`}>
              {item}
            </label>
          </>
        );
      })}
    </div>
  );

  const renderModalButton = () => {
    return isMobile ? undefined : (
      <button className="about-icon" onClick={showAbout}>
        <About />
      </button>
    );
  }

  const renderDesktop = () => {
    return (
      <>
        {renderSort}
        {renderFilters}
        {renderSearch}
        {renderModalButton()}
      </>
    );
  };

  const renderMobile = () => {
    return (
      <div className="mobile-menu" ref={mobileMenuRef}>
        <button className="menu-button" onClick={() => setShowMenu((current) => !current)}>
          <Menu />
        </button>
        {showMenu && (
          <div className="mobile-menu-content">
            {renderModalButton()}
            {renderSearch}
            {renderSort}
            {renderFilters}
          </div>
        )}
      </div>
    );
  };

  const handleClickOutside = () => {
    setShowMenu(false);
  };

  const [showMenu, setShowMenu] = useState(false);
  const { width } = useViewport();
  const isMobile = width <= breakpoints.mobile;
  const viewportClass = isMobile ? 'image-nav--mobile' : 'image-nav--desktop';

  const mobileMenuRef = useRef(null);
  useOutsideAlerter(mobileMenuRef, handleClickOutside);

  useEffect(() => {
    if (!isMobile) {
      setShowMenu(false);
    }
  }, [isMobile]);

  return (
    <div className={`image-nav ${viewportClass} ${className}`}>
      <div className="framed-icon">
        <FramedIcon />
      </div>
      {!isMobile && renderDesktop()}
      {isMobile && renderMobile()}
    </div>
  );
};

export default ImageNav;
