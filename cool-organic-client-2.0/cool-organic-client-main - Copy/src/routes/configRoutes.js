import Home from '../pages/Home';
import Products from '../pages/Products';
import TopSelling from '../pages/TopSelling';
import ProductDetail from '../pages/ProductDetail';
import CategoryProduct from '../pages/CategoryProduct';
import Cart from '../pages/Cart';
import Admin from '../pages/Admin';
import AdminLogin from '../pages/Admin/Login';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserInfo from '../pages/UserInfo';
import Introduce from '../pages/Introduce';
import Contact from '../pages/Contact';
import CheckOut from '../pages/CheckOut';
import ThankYou from '../pages/ThankYou';
import Search from '../pages/Search';
import NotFound from '../pages/NotFound';

import { ADMIN_LAYOUT, NO_LAYOUT } from '../constants/layouts';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/products',
    component: Products,
  },
  {
    path: '/top-selling',
    component: TopSelling,
  },
  {
    path: '/cart',
    component: Cart,
    protected: true,
    roleListPermission: ['admin', 'user'],
  },
  {
    path: '/checkout',
    component: CheckOut,
    protected: true,
    roleListPermission: ['admin', 'user'],
  },
  {
    path: '/checkout/thank-you/:orderId',
    component: ThankYou,
    protected: true,
    roleListPermission: ['admin', 'user'],
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/products/:slug',
    component: ProductDetail,
  },
  {
    path: '/:categorySlug',
    component: CategoryProduct,
  },
  {
    path: '/admin/*',
    component: Admin,
    protected: true,
    roleListPermission: ['admin'],
    layout: ADMIN_LAYOUT,
  },
  {
    path: '/admin/login',
    component: AdminLogin,
    layout: NO_LAYOUT,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/my-info/*',
    component: UserInfo,
    protected: true,
    roleListPermission: ['admin', 'user'],
  },
  {
    path: '/introduce',
    component: Introduce,
  },
  {
    path: '/contact',
    component: Contact,
  },
  {
    path: '/*',
    component: NotFound,
  },
];

export default routes;
