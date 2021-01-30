import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { FramedIcon, Menu, SortDown, SortUp } from '../assets/svgIcons';
import { breakpoints, useOutsideAlerter, useViewport } from '../utils/utils';


const ImageNav = ({ className, options, reverseSort, updateSort, updateType, updateSearch }) => {
  const [active, setActive] = useState(options[0]);
  const [type, setType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

    /*const renderAbout = () => (
        <div className="about">
            <button className="about-icon" onClick={() => setShowAbout((current) => !current)}>
                <About />
            </button>
            {showAbout && (
                <div className="about-modal">
                    <div className="about-modal-content" ref={aboutModalRef}>
                        <div className="framed-icon">
                            <FramedIcon />
                        </div>
                        Hall-of-framed website which contains various galleries with screenshots made by the members of the community
                    </div>
                </div>
            )}
        </div>
    )*/
    
    const renderDesktop = () => {
       return (
           <>
            {renderSort}
            {renderFilters}
            {renderSearch}
            {/* {renderAbout()} */}
           </>
       )
    }
    
  const renderMobile = () => {
    return (
      <>
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
      </>
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

  /*
  const aboutModalRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);
  useOutsideAlerter(aboutModalRef, handleClickOutsideAboutModal);
  const handleClickOutsideAboutModal = () => {
    setShowAbout(false);
  }
  */

  useEffect(() => {
      if (!isMobile) {
          setShowMenu(false);
      }
  }, [isMobile])
    
  return (
      <div className={`image-nav ${viewportClass} ${className}`}>
          <div className="framed-icon">
              <FramedIcon/>
          </div>
          {!isMobile && renderDesktop()}
          {isMobile && renderMobile()}
      </div>
  )
}

export default ImageNav;
