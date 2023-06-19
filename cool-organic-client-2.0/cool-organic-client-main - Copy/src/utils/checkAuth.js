import handleLocalStorage from './handleLocalStorage';
import handleAuthToken from './handleAuthToken';

const checkAuth = () => {
  const accessToken = handleLocalStorage.get('accessToken');
  if (!accessToken) {
    return false;
  }
  handleAuthToken(accessToken);
  return true;
};

export default checkAuth;
