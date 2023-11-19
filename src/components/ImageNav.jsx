import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router-dom";
import { About, FramedIcon, Menu, SortDown, SortUp } from '../assets/svgIcons';
import AboutModalContent from '../components/AboutModalContent';
import { ModalContext } from '../utils/context';
import { useOutsideAlerter, useViewport } from '../utils/hooks';
import { breakpoints } from '../utils/utils';
import AdvancedSearch from './AdvancedSearch';

const ImageNav = ({ className, options, reverseSort, updateSort, updateFormat, onLogoClick, searchProps }) => {
  const [active, setActive] = useState(options[0]);
  const [type, setType] = useState('All');
  const [searchFocused, setSearchFocused] = useState(false);
  const { setModal } = useContext(ModalContext);
  const history = useHistory();

  const [showMenu, setShowMenu] = useState(false);
  const { width } = useViewport();
  const isMobile = width <= breakpoints.mobile;
  const viewportClass = isMobile ? 'image-nav--mobile' : 'image-nav--desktop';

  const handleOptionChange = (selection) => {
    setActive(selection);
    updateSort(selection);
  };

  const handleFormatChange = (value) => {
    setType(value);
    updateFormat(value);
  };

  const handleLogoClick = () => {
    setType('All');
    setActive(options[0]);
    onLogoClick();
  }

  const showAbout = () => {
    const modalComponent = <AboutModalContent />;

    setModal({ show: true, component: modalComponent, className: 'about-window', withClose: true });
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  }

  const handleSearchBlur = () => {
    setSearchFocused(false);
  }

  const formats = ['All', 'Wide', 'Portrait'];
  const icon = reverseSort ? <SortUp key='sortup'/> : <SortDown key='sortdown'/>;

  const renderSearch = ()=> {
    return (
      <AdvancedSearch
        handleSearchFocus={handleSearchFocus}
        handleSearchBlur={handleSearchBlur}
        focused={searchFocused}
        isMobile={isMobile}
        {...searchProps}
      />
    )
  }

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
              tabIndex={index}
            >
              {item.label}
              {isActive && active.key!== 'random' && icon}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const renderFilters = () => {
    const hiddenClass = searchFocused && !isMobile ? 'hidden' : false;
    
    return (
      <div className={classNames('image-types', hiddenClass)}>
        {formats.map((item, index) => {
          return (
            <React.Fragment key={`${item}-filter`}>
              <input
                id={`${item}-label`}
                onChange={() => handleFormatChange(item)}
                checked={type === item}
                type="radio"
                value={item}
                name="type"
                tabIndex={options.length+index}
              />
              <label htmlFor={`${item}-label`} tabIndex={options.length+index}>
                {item}
              </label>
            </React.Fragment>
          );
        })}
      </div>
    )
  }

  const aboutButtonContent = isMobile ? <About /> : "About";
  const aboutClass = isMobile ? "mobile" : "desktop";

  const aboutIconButton = (
    <button className={classNames("about-icon", aboutClass)} onClick={showAbout}>
      {aboutButtonContent}
    </button>
  );

  const renderDesktop = () => {
    return (
      <>
        {renderSort}
        {renderFilters()}
        {renderSearch()}
        {aboutIconButton}
      </>
    );
  };

  const handleMobileMenuButton = () => {
    setShowMenu((current) => !current);
  }

  const renderMobile = () => {
    const mobileMenuClass = showMenu ? 'show' : false;
    return (
      <div className={classNames('mobile-menu', mobileMenuClass)} ref={mobileMenuRef}>
        <button className="menu-button" onClick={handleMobileMenuButton}>
          <Menu />
        </button>
        {showMenu && (
          <div className="mobile-menu-content-mask">
            <div className="mobile-menu-content">
              {renderSearch()}
              {renderSort}
              {renderFilters()}
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

  const handleScroll = React.useCallback(() => {
    if(!searchFocused) {
      setShowMenu(false);
    }
  },[searchFocused]);

  const mobileMenuRef = useRef(null);
  useOutsideAlerter(mobileMenuRef, handleClickOutside);

  useEffect(() => {
    if (!isMobile) {
      setShowMenu(false);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, history, handleScroll]);

  return (
    <div className={`image-nav ${viewportClass} ${className}`}>
      <div className="framed-icon">
        <button onClick={handleLogoClick} type="button"><FramedIcon /></button>
      </div>
      {!isMobile && renderDesktop()}
      {isMobile && renderMobile()}
    </div>
  );
};

export default React.memo(ImageNav);
