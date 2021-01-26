import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Spinner extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    modifier: PropTypes.string,
    show: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    show: false,
    modifier: ''
  };

  constructor(props) {
    super(props);

    this.renderSpinner = this.renderSpinner.bind(this);
    this.baseClass = 'framed-spinner';
  }

  get svgSpinner() {
    return (
      <div className={`${this.baseClass}-svg-wrapper`}>
        <svg className={`${this.baseClass}-svg-back`} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" />
        </svg>
        <svg className={`${this.baseClass}-svg-segment`} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" />
        </svg>
      </div>
    );
  }

  get spinnerContainer() {
    const { modifier } = this.props;
    const modifierClass = modifier ? 'global' : false;

    return <div className={`${this.baseClass}-container ${modifierClass}`}>{this.spinner}</div>;
  }

  get spinner() {
    const { className, modifier } = this.props;

    return (
      <div
        className={classNames(
          this.baseClass,
          `${this.baseClass}--${modifier}`,
          className
        )}
      >
        {this.svgSpinner}
      </div>
    );
  }

  renderSpinner() {
    return this.spinnerContainer;
  }

  render() {
    const { show } = this.props;

    return show ? this.renderSpinner() : null;
  }
}

export default Spinner;
