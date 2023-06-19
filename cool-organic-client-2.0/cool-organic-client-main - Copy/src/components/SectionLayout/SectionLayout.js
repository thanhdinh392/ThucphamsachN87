import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

const SectionLayout = ({ title, children, className = '', path = '/' }) => {
  return (
    <div className={`container pt-5 md:pt-8 lg:pt-12 text-center ${className}`}>
      <h2 className='mb-3 md:mb-5'>
        <Link
          to={path}
          className='text-2xl md:text-3xl font-medium uppercase text-gradient'
        >
          {title}
        </Link>
      </h2>
      <span className='inline-block mb-3 md:mb-4 icon-green'></span>
      <div>{children}</div>
    </div>
  );
};

SectionLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  path: PropTypes.string,
};

export default SectionLayout;
