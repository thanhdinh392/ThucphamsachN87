import { useEffect } from 'react';

const useCLickOutSide = (ref, callback) => {
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);
    document.addEventListener('touchstart', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
      document.removeEventListener('touchstart', handleClickOutSide);
    };
  }, []);
};

export default useCLickOutSide;
