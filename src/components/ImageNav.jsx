import React, { useState } from 'react';
import classNames from 'classnames';
import { SortUp, SortDown, FramedIcon } from '../assets/svgIcons';

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

    return (
        <div className={`image-nav ${className}`}>
            <FramedIcon/>
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
        </div>
    )
}

export default ImageNav;