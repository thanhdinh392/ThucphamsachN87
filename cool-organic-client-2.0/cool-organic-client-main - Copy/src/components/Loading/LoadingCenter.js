import PropTypes from 'prop-types';

import './Loading.scss';

const LoadingCenter = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className='loader-spinner w-[30px] h-[30px]'> </div>
    </div>
  );
};

LoadingCenter.propTypes = {
  className: PropTypes.string,
};

export default LoadingCenter;
