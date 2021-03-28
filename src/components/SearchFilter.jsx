import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Cancel } from '../assets/svgIcons';

class SearchFilter extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      startAnimate: false
    };
  }

  componentDidMount() {
    this.timeoutId = setTimeout(function () {
      this.setState({startAnimate: true});
    }.bind(this), 1);
  }

  render() {
    const { className, onClick, text } = this.props;
    const {startAnimate} = this.state;
    const normalClass = startAnimate ? 'normal' : false;

    return (
      <button 
        key={`filter-${text}`} 
        className={classNames(className, normalClass)} 
        onClick={onClick}
      >
        <span className="filter-text">{text}</span> 
        <span className="cancel-button"><Cancel /></span>
      </button>
    )
  }
}

export default SearchFilter;
