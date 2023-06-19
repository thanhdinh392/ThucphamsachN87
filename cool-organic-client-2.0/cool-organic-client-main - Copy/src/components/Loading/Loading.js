import PropTypes from 'prop-types';

import './Loading.scss';

const Loading = ({ className = 'w-[30px] h-[30px]' }) => {
  return <div className={`loader-spinner ${className}`}></div>;
};

Loading.propTypes = {
  className: PropTypes.string,
};

export default Loading;
