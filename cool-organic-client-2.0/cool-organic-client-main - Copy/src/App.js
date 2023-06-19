import { useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Routers from './routes/Routers';
import {
  removeCurrentUser,
  setCurrentUser,
  setLoadingCurrentUser,
} from './redux/userSlice';
import checkAuth from './utils/checkAuth';
import authApi from './api/authApi';
import { setCart, setIsLoadingCart } from './redux/cartSlice';
import cartApi from './api/cartApi';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const autoLogin = async () => {
      dispatch(setLoadingCurrentUser(true));
      if (!checkAuth()) {
        dispatch(setLoadingCurrentUser(false));
        return;
      }
      try {
        const res = await authApi.getCurrentUser();
        const { user } = res.data;
        if (!user) {
          return;
        }
        const currentUser = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
        };
        dispatch(setCurrentUser(currentUser));
      } catch (error) {
        removeCurrentUser();
      }
      dispatch(setLoadingCurrentUser(false));
    };

    autoLogin();
  }, [dispatch]);

  useEffect(() => {
    const getCart = async () => {
      dispatch(setIsLoadingCart(true));
      if (!checkAuth()) {
        dispatch(setIsLoadingCart(false));
        return;
      }
      try {
        const res = await cartApi.getCart();
        const cart = res.data.cart;
        if (!cart) {
          return;
        }
        dispatch(setCart(cart));
      } catch (error) {
        removeCurrentUser();
      }
      dispatch(setIsLoadingCart(false));
    };

    getCart();
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search, location.pathname]);

  return (
    <Fragment>
      <Routers />
    </Fragment>
  );
}

export default App;
