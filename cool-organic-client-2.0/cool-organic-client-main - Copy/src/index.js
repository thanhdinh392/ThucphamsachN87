import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/pagination';

import './index.css';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <GlobalStyles>
          <App />
          <ToastContainer autoClose={2000} draggable={false} />
        </GlobalStyles>
      </Router>
    </Provider>
  </React.StrictMode>
);
