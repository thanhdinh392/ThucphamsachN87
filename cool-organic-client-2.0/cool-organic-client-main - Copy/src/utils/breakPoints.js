const breakPoints = {
  isMobile: () => {
    return window.innerWidth < 768;
  },
  isTablet: () => {
    return window.innerWidth >= 768 && window.innerWidth < 1025;
  },
  isPC: () => {
    return window.innerWidth >= 1025;
  },
};

export default breakPoints;
