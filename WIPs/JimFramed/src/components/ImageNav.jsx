import React, { useState } from 'react';
import classNames from 'classnames';

const ImageNav = ({filters, updateFilter, updateType, updateSearch}) => {
    const [active, setActive] = useState(0);
    const [type, setType] = useState('All')
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (selection) => {
        setActive(selection.value);
        updateFilter(selection);
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

    return (
        <div className="image-nav">
            <ul className="filters">
            {filters.map(item => {
                const buttonClass = active === item.value ? 'is-active' : undefined;

                return (
                    <li>
                        <button
                        className={classNames('filter', buttonClass)}
                            onClick={() => handleFilterChange(item)}
                            key={item.label}
                        >
                        {item.label}
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
                                key={item}
                            /> <label htmlFor={`${item}-label`}>{item}</label>
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