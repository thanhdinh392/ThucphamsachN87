const routes = [
  {
    path: '/',
    breadCrumbName: 'Trang chủ',
  },
  {
    path: '/products',
    breadCrumbName: 'Tất cả sản phẩm',
  },
  {
    path: '/top-selling',
    breadCrumbName: 'Sản phẩm bán chạy',
  },
  {
    path: '/cart',
    breadCrumbName: 'Giỏ hàng',
  },
  {
    path: '/search',
    breadCrumbName: 'Trang tìm kiếm',
  },
  {
    path: '/my-info',
    breadCrumbName: 'Tài khoản',
  },
  {
    path: '/my-info/orders',
    breadCrumbName: 'Đơn hàng',
  },
  {
    path: '/my-info/orders/:orderId',
    breadCrumbName: 'Chi tiết đơn hàng',
  },
  {
    path: '/my-info/change-password',
    breadCrumbName: 'Thay đổi mật khẩu',
  },
  {
    path: '/products/:slug',
    breadCrumbName: 'Chi tiết sản phẩm',
  },
  {
    path: '/:categorySlug',
    breadCrumbName: 'Danh mục sản phẩm',
  },
  {
    path: '/login',
    breadCrumbName: 'Đăng nhập',
  },
  {
    path: '/register',
    breadCrumbName: 'Đăng ký',
  },
  {
    path: '/introduce',
    breadCrumbName: 'Giới thiệu',
  },
  {
    path: '/contact',
    breadCrumbName: 'Liên hệ',
  },
  {
    path: '/*',
    breadCrumbName: 'Trang không tồn tại',
  },
];

export default routes;
