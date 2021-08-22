import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';
import DatePicker from 'react-date-picker';
import { Cancel, Search } from '../assets/svgIcons';
import { useOutsideAlerter } from '../utils/hooks';
import { getSearchKey } from '../utils/utils';
import SearchFilter from './SearchFilter';

const AdvancedSearch = ({ 
    handleSearchFocus, 
    handleSearchBlur, 
    updateFilters,
    updateSearch, 
    focused,
    searchText, 
    filters, 
    searchData, 
    isMobile 
  }) => {
  const delimiter = ',';

  const convertTextToFilters = useCallback((text, currentFilters) => {
    const index = text.indexOf(delimiter);
    const newFilters = currentFilters.slice();
    if (index > -1) {
      const filter = text.substring(0, index);
      const remaining = text.substring(index+1, text.length);
      newFilters.push(filter);
      return convertTextToFilters(remaining, newFilters);
    }
    return {text, newFilters}
  }, [])

  const processSearchInput = useCallback((inputValue) => {
    const { text, newFilters } = convertTextToFilters(inputValue, []);
    updateSearch(text.trimStart());
    if (newFilters.length) {
      updateFilters(filters.concat(newFilters));
    }
  }, [filters, convertTextToFilters, updateFilters, updateSearch]);

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    if (isMobile) {
      if (inputValue === '') {
        updateFilters([]);
      } else {
        const newFilters = inputValue.split(delimiter).map(e => e.trimStart());
        updateFilters(newFilters);
      }
      updateSearch(inputValue);
    } else {
      processSearchInput(inputValue);
    }
  };

  const clearSearch = () => {
    updateSearch('');
  };

  const handleKeyboard = React.useCallback(
    (event) => {
      const { key } = event;

      if (!focused) {
        return false;
      }

      switch (key) {
        case 'Enter':
          return processSearchInput(`${searchText}${delimiter}`);
        default:
          return false;
      }
    },
    [focused, processSearchInput, searchText],
  );

  const handleScroll = React.useCallback(() => {
    handleSearchBlur();
  },[handleSearchBlur]);

  const handleClickOutside = () => {
    if (isMobile) {
      return;
    }
    handleSearchBlur();
  };

  const handleFocus = () => {
    if (isMobile) {
      return;
    }
    const text = searchText;
    updateSearch('');
    updateSearch(text);
    handleSearchFocus();
  }

  const getSearchOptionText = () => {
    const delimiterIndex = searchText.indexOf(':');
    return searchText.substr(0, delimiterIndex);
  }

  const removeFilter = (filterToRemove) => {
    const index = filters.findIndex((e) => e === filterToRemove);
    const newFilters=filters.slice();
    newFilters.splice(index, 1);
    updateFilters(newFilters);
    searchInputRef?.current?.focus();
  }

  const addDate = (value) => {
    const isoValue = value.toISOString();
    const dateValue = isoValue.substr(0,isoValue.indexOf('T'));
    const searchOptionText = getSearchOptionText();

    searchInputRef?.current?.focus();
    processSearchInput(`${searchOptionText}: ${dateValue}${delimiter}`);
  }

  const addHelper = (helperText) => {
    const searchOptionText = getSearchOptionText();

    searchInputRef?.current?.focus();
    processSearchInput(`${searchOptionText}: ${helperText}${delimiter}`);
  }

  const addSearchOption = (item) => {
    searchInputRef?.current?.focus();
    updateSearch(`${item.label}${item.helperText}`);
  }

  const addOperator = (item) => {
    const searchOptionText = getSearchOptionText();
    searchInputRef?.current?.focus();
    updateSearch(`${searchOptionText}: ${item.operator}`);
  }

  const renderSearchOptions = () => {
    const { searchOptions } = searchData;
    const validSearchOptions = searchOptions.filter(item => {
      return !searchText.length || item.label.includes(searchText)
    })
    
    return (
      <>
        <div className="search-header">Search Options:</div>
        {validSearchOptions.map((item) => {
          return !item.hide ? (
            <div 
              className="search-option" 
              key={`searchoption-${item.label}`}
              onClick={() => addSearchOption(item)} 
            >
              <span>{item.label}:</span>
              <span className="search-hint">{` ${item.hint}`}</span>
            </div>
          ) : null;
        })}
      </>
    )
  }

  const renderDatePicker = (searchOption) => {
    return (
      <>
        <span className="search-header">Search {searchOption}: {` `}</span>
        <DatePicker
          onChange={addDate}
          isOpen={true}
          closeCalendar={false}
          maxDate={searchData.maxDate}
          minDate={searchData.minDate}
        />
      </>
    )
  }
  
  const renderColorPicker = (searchOption, searchOptionData) => {
    return (
      <>
        <span className="search-header">Search {searchOption}: {` `}</span>
        {searchOptionData.entries.map((item, index) => {
          return (
            <span
              key={`color-picker-${index}`} 
              className="color-block" 
              style={{backgroundColor: item}} 
              onClick={()=>addHelper(item)} 
            ></span>
          )
        })}
      </>
    )
  }

  const renderEntries = (entries) => {
    const delimiterIndex = searchText.indexOf(':');
    const searchTermText = searchText.substr(0, delimiterIndex);
    const searchOptionText = searchText.substr(delimiterIndex + 1, searchText.length).toLowerCase().trimStart();
    if (!searchOptionText.length > 0) {
      return <div>Type to narrow list...</div>
    }
    const validEntries = entries.filter(item => item.toLowerCase().includes(searchOptionText));
    const limitEntries = validEntries.slice(0, 10);
    return (
      <>
        <div className="search-header">{searchTermText} possibilities:</div>
        {limitEntries.map((item, index) => {
          return (
            <div 
              key={`search-helper${index}`} 
              className={classNames('search-option')}
              onClick={()=>addHelper(item)}
            >
              <span className='result'>{item}</span>
            </div>
          )
        })}
      </>
    )
  }

  const renderSearchHelpers = () => {
    const delimiterIndex = searchText.indexOf(':');
    const searchOption = searchText.substr(0, delimiterIndex);
    const searchKey = getSearchKey(searchOption);

    if (!searchKey) {
      return <div className="search-header">Text search</div>
    }

    if (searchKey === 'epochtime') {
      return renderDatePicker(searchOption);
    }
    
    const searchOptions = searchData.searchOptions;
    const searchOptionIndex = searchOptions.findIndex(e => e.label === searchOption);
    const searchOptionData = searchOptions[searchOptionIndex];
    const operators = ['<', '>', '='];
    const showOperators = operators.every(item => searchText.indexOf(item) === -1);

    if (searchKey === 'colorName') {
      return renderColorPicker(searchOption, searchOptionData);
    }

    if (searchOptionData.helpers && searchOptionData.entries?.length) {
      return renderEntries(searchOptionData.entries)
    } else if (searchOptionData.type === 'number' && showOperators) {
      return searchData.numberHelpers.map((item) => {
        return (
          <div 
            className="search-option" 
            key={`operator-${item.label}`}
            onClick={() => addOperator(item)}
          >
            <span>{item.label}:</span>
            <span className="search-hint operator">{item.hint}</span>
          </div>
        )
      })
    } else if (searchOptionData.type === 'number' && !showOperators) {
      const min = searchOptionData.range[0]
      const max = searchOptionData.range[1];
      return (
        <div className='range-info'>
          <p>Enter number to filter by <span>{searchOptionData.label}.</span></p>
          <span>{searchOptionData.label}</span> ranges from <span>{`${min}`}</span> to <span>{`${max}`}</span>
        </div>
      )
    }
    return null;
  }

  const renderCurrentFilters = () => {
    return (
      <div className="current-filters">
        <span className="search-header">Current filters:</span>
        {filters.map((item, index) => {
          if (!item.length || item === ' ') {
            return null;
          }
          return (
            <SearchFilter 
              key={`filter-${index}`} 
              className='search-filter' 
              text={item}
              onClick={()=>removeFilter(item)}
            />
          );
        })}
      </div>
    ) 
  }

  const activeClass = searchText.length > 0 ? 'active' : undefined;
  const focusedClass = focused ? 'focused' : false;
  const advancedSearchRef = useRef(null);
  const searchInputRef = useRef(null);
  const filterText = filters.length > 1 ? 'filters' : 'filter';
  const filterPlaceholder = filters.length > 0 ? ` (${filters.length} ${filterText} active)` : '';
  useOutsideAlerter(advancedSearchRef, handleClickOutside);

  React.useEffect(() => {
    window.addEventListener('keyup', handleKeyboard);
    window.addEventListener('scroll', handleScroll);

    if (isMobile && filters.length > 0 && !searchText) {
      updateSearch(filters);
    }

    return () => {
      window.removeEventListener('keyup', handleKeyboard);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleKeyboard, handleScroll, filters, updateSearch, isMobile, searchText]);

  return (
    <div className={classNames('search', activeClass, focusedClass)} ref={advancedSearchRef}>
      <input
        type="search"
        name="search"
        className="search-input"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={`Search${filterPlaceholder}`}
        autoComplete='off'
        onClick={handleFocus}
        onFocus={handleFocus}
        ref={searchInputRef}
        autoFocus={isMobile ? true : false}
      />
      {isMobile && (<Search className="search" />)}
      {focused && (<button className="cancel" onClick={clearSearch}>
        <Cancel />
      </button>)}
      {!isMobile && (
        <div className="search-filters">
          {focused && (
            <div className='filter-options'>
            {!searchText.includes(':') && renderSearchOptions()}
            {searchText.includes(':') && renderSearchHelpers()}
          </div>
          )}
          {renderCurrentFilters()}
        </div>
      )}
    </div>
  );
};

export default React.memo(AdvancedSearch);
