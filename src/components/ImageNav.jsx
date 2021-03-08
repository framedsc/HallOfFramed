import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router-dom";
import { About, Cancel, FramedIcon, Menu, Search, SortDown, SortUp } from '../assets/svgIcons';
import AboutModalContent from '../components/AboutModalContent';
import { ModalContext } from '../utils/context';
import { breakpoints, useOutsideAlerter, useViewport } from '../utils/utils';

const ImageNav = ({ className, options, reverseSort, updateSort, updateFormat, updateSearch, defaultSearch }) => {
  const [active, setActive] = useState(options[0]);
  const [type, setType] = useState('All');
  const [searchTerm, setSearchTerm] = useState(defaultSearch || '');
  const { setModal } = useContext(ModalContext);
  const history = useHistory()

  const handleOptionChange = (selection) => {
    setActive(selection);
    updateSort(selection);
  };

  const handleFormatChange = (value) => {
    setType(value);
    updateFormat(value);
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);
    updateSearch(inputValue);
  };

  const clearSearch = () => {
    setSearchTerm('');
    updateSearch('');
  };

  const showAbout = () => {
    const modalComponent = <AboutModalContent />;

    setModal({ show: true, component: modalComponent, className: 'about-window', withClose: true });
  };

  const formats = ['All', 'Wide', 'Portrait'];
  const icon = reverseSort ? <SortUp key='sortup'/> : <SortDown key='sortdown'/>;
  const activeClass = searchTerm.length > 0 ? 'active' : undefined;

  const renderSearch = (
    <div className={classNames('search', activeClass)}>
      <input
        type="search"
        name="search"
        className="search-input"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
        autoComplete='off'
      />
      <Search className="search" />
      <button className="cancel" onClick={clearSearch}>
        <Cancel />
      </button>
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
      {formats.map((item) => {
        return (
          <>
            <input
              id={`${item}-label`}
              onChange={() => handleFormatChange(item)}
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

  const aboutIconButton = (
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
        {aboutIconButton}
      </>
    );
  };

  const renderMobile = () => {
    const mobileMenuClass = showMenu ? 'show' : false;
    return (
      <div className={classNames('mobile-menu', mobileMenuClass)} ref={mobileMenuRef}>
        <button className="menu-button" onClick={() => setShowMenu((current) => !current)}>
          <Menu />
        </button>
        {showMenu && (
          <div className="mobile-menu-content-mask">
            <div className="mobile-menu-content">
              {renderSearch}
              {renderSort}
              {renderFilters}
            </div>
          </div>
        )}
        {aboutIconButton}
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
    const search = window.location.search;
    const params = new URLSearchParams(search);
    params.delete("search");
    if (!isMobile) {
      setShowMenu(false);
    }

    if (searchTerm) {
      params.append("search", searchTerm)
    } 
    history.push({search: params.toString()})
  }, [isMobile, history, searchTerm]);

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
