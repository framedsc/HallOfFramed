import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { SortUp, SortDown, FramedIcon, Menu } from '../assets/svgIcons';
import { useViewport, breakpoints, useOutsideAlerter } from '../utils/utils';

const ImageNav = ({className, options, reverseSort, updateSort, updateType, updateSearch}) => {
    const [active, setActive] = useState(options[0]);
    const [type, setType] = useState('All')
    const [searchTerm, setSearchTerm] = useState('');

    const handleOptionChange = (selection) => {
        setActive(selection);
        updateSort(selection);
    }

    const handleTypeChange = (value) => {
        setType(value);
        updateType(value);
    }

    const handleSearchChange = event => {
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
                placeholder={'Search'}
                value={searchTerm}
                onChange={handleSearchChange}
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
                        className={classNames('filter', buttonClass)}
                        onClick={() => handleOptionChange(item)}
                        key={item.label}
                    >
                    <>
                        {item.label}
                        {isActive && icon}
                    </>
                    </button>
                </li>
            );
        })}
        </ul>
    );
    
    const renderFilters = (
        <div className="image-types">
            {types.map(item => {
                return(
                    <>
                        <input 
                            id={`${item}-label`}
                            onChange={()=> handleTypeChange(item)}
                            checked={type===item} 
                            type="radio" 
                            value={item} 
                            name="type" 
                            key={`${item}-input`}
                        /> 
                        <label key={`${item}-label`} htmlFor={`${item}-label`}>{item}</label>
                    </>
                )
            })}
        </div>
    );
    
    const renderDesktop = () => {
       return (
           <>
            {renderSort}
            {renderFilters}
            {renderSearch}
           </>
       )
    }

    const renderMobile = () => {
        return (
            <div className="mobile-menu" ref={mobileMenuRef}>
                <button 
                    className="menu-button" 
                    onClick={() => setShowMenu((current) => !current)}>
                        <Menu />
                </button>
                {showMenu && (
                <div className="mobile-menu-content">
                    {renderSearch}
                    {renderSort}
                    {renderFilters}
                </div>)}
            </div>
        )
    }

    const handleClickOutside = () => {
        setShowMenu(false);
    }

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
    }, [isMobile])
    
    return (
        <div className={`image-nav ${viewportClass} ${className}`}>
            <FramedIcon/>
            {!isMobile && renderDesktop()}
            {isMobile && renderMobile()}
        </div>
    )
}

export default ImageNav;