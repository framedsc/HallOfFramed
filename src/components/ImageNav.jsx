import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { About, FramedIcon, Menu, SortDown, SortUp } from '../assets/svgIcons';
import { ModalContext } from '../utils/ModalContext';
import { breakpoints, useOutsideAlerter, useViewport } from '../utils/utils';

const ImageNav = ({ className, options, reverseSort, updateSort, updateType, updateSearch }) => {
  const [active, setActive] = useState(options[0]);
  const [type, setType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { modal, setModal } = useContext(ModalContext);

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
      <div className="about-modal">
      <div className="about-modal-content">
        <div className="framed-icon">
          <FramedIcon />
        </div>
        Hall-of-framed website which contains various galleries with screenshots made by the
        members of the community
      </div>
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

  const modalButton = (
      <button className="about-icon" onClick={showAbout}>
        <About />
      </button>
    );

  const renderDesktop = () => {
    return (
      <>
        {renderSort}
        {renderFilters}
        {renderSearch}
        {modalButton}
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
