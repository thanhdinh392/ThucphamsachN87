import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleShow = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleShow);

    return () => window.removeEventListener('scroll', handleShow);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`w-[50px] h-[50px] rounded-full bg-primaryColor flex items-center justify-center text-white fixed z-[1000] right-8 bottom-6 cursor-pointer transition-all opacity-0 ${
        show ? 'visible opacity-100' : 'invisible opacity-0'
      } hover:text-black hover:opacity-90`}
      onClick={handleScrollToTop}
    >
      <i className='fa-solid fa-arrow-up'></i>
    </div>
  );
};

export default ScrollToTop;
