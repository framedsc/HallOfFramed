import classNames from 'classnames';
import React from 'react';

const Spinner = ({show = false, className, modifier='' }) => {
  const baseClass = 'framed-spinner';

  const svgSpinner = (
    <div className={`${baseClass}-svg-wrapper`}>
      <svg className={`${baseClass}-svg-back`} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" />
      </svg>
      <svg className={`${baseClass}-svg-segment`} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" />
      </svg>
    </div>
  );

  const spinner = (
    <div
      className={classNames(baseClass, `${baseClass}--${modifier}`, className)}
    >
      {svgSpinner}
    </div>
    );

    const spinnerContainer = () => {
      const modifierClass = modifier ? 'global' : false;
  
      return <div className={`${baseClass}-container ${modifierClass}`}>{spinner}</div>;
    }

  return show ? spinnerContainer() : null;
};

export default Spinner;