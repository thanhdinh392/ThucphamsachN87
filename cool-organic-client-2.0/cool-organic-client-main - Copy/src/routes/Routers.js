import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';

import routes from './configRoutes';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import { ADMIN_LAYOUT, NO_LAYOUT } from '../constants/layouts';

const layouts = {
  [ADMIN_LAYOUT]: AdminLayout,
  [NO_LAYOUT]: Fragment,
};

const Routers = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        let Component = route.component;
        let Layout = layouts[route.layout] || MainLayout;

        if (route.protected) {
          Component = (
            <ProtectedRoute roleListPermission={route.roleListPermission}>
              <Layout>
                <route.component />
              </Layout>
            </ProtectedRoute>
          );
        } else {
          Component = (
            <Layout>
              <route.component />
            </Layout>
          );
        }

        return <Route key={index} path={route.path} element={Component} />;
      })}
    </Routes>
  );
};

export default Routers;
